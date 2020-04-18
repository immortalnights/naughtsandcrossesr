const _ = require('underscore');
const EventEmitter = require('events');
const Player = require('./player');
const Vector2D = require('./vector2d');

class AIEventIO extends EventEmitter
{
	join()
	{
		// No-op for AI players
		console.debug("AISocket:join");
	}

	leave()
	{
		// No-op for AI players
		console.debug("AISocket:leave");
	}
};

const random = (min, max) => {
	return Math.floor(Math.random() * (max - min) ) + min;
}

const Brain = {
	novice: (ai, board, makeMove) => {
		const locationToGrid = (loc) => {
			const x = Math.floor(loc / 3);
			const y = (loc % 3);

			return { x, y };
		};

		let location;
		while (!location)
		{
			const test = locationToGrid(random(0, 9));
			// console.log("T", test);
			if (board.at(test) === '')
			{
				location = test;
			}
		}

		makeMove(location);
	},

	intermediate: (token, cells) => {
		const findCellNextToOwn = () => {
			let picked;

			// get all token indexes for own tokens
			let own = [];
			cells.forEach((t, i) => { if (t === token) { own.push(i); } });
			console.log(own);

			// pick somewhere random for first move
			if (own.length === 0)
			{
				picked = Brain.novice(token, cells);
			}
			else
			{
				const ajacent = [-4, -2, 2, 4, -3, 1, 3, -1];

				// 
				own.find(cell => {
					console.log(cell);
					const adj = ajacent.find(adj => {
						let ok = false;

						const adjCell = cell + adj;

						if ((cell % 3 === 0 && adjCell % 3 === 2) || (cell % 3 === 2 && adjCell % 3 === 0))
						{

						}
						else
						{
							ok = (cells[adjCell] === '');
							console.log(cell, '->', adj, ok);
						}

						return ok;
					});

					console.log(adj);
					if (adj !== undefined)
					{
						picked = cell + adj;
					}

					return picked !== undefined;
				});
			}

			console.log("picked", picked);
			return picked;
		};

		console.log("Brain:intermediate", token, cells)
		return findCellNextToOwn();
	},

	expert: (ai, board, makeMove) => {
		// check for blocks
		const paths = board.paths(3);
		const winningPaths = paths.filter(p => {
			const tokens = _.compact(_.pluck(p, 'token'));
			return tokens.length === 2 && tokens.every(t => t === ai.token);
		});
		// console.log("Winning Paths")
		// console.log(pathArrayToString(winningPaths));

		const blockingPaths = paths.filter(p => {
			const tokens = _.compact(_.pluck(p, 'token'));
			return tokens.length === 2 && tokens.every(t => t !== ai.token);
		});
		// console.log("Blocking Paths");
		// console.log(pathArrayToString(blockingPaths));

		const tryMove = location => {
			const ok = board.at(location) === '';

			if (ok)
			{
				// ai.emit('place:token', location);
				makeMove(location);
			}

			return ok;
		};

		const tryMoves = paths => {
			let moved = false;
			if (_.isEmpty(paths) === false)
			{
				moved = paths.some(path => {
					return path.some(cell => {
						return tryMove(cell.location);
					});
				});
			}

			return moved;
		}

		if (tryMoves(winningPaths))
		{
			console.log("Took a winning move", ai.token);
		}
		else if (tryMoves(blockingPaths))
		{
			console.log("Took a blocking move", ai.token);
		}
		else if (board.at(board.center) === '')
		{
			tryMove(board.center);
			console.log("Took center", ai.token);
		}
		else
		{
			// find taken corners
			const corners = _.shuffle(board.corners);
			const taken = corners.filter(c => {
				const t = board.at(c);
				return ai.token !== t && t !== '';
			});
			// console.log("taken", taken);

			// place in the opposite if it's free
			// 0, 0 <=> 2, 2
			// 0, 2 <=> 2, 2
			const opposite = taken.map(c => {
				return new Vector2D(board.width - 1 - c.x, board.height - 1 - c.y);
			});
			// console.log("opposite", opposite);

			if (_.isEmpty(opposite) == false && opposite.some(tryMove))
			{
				console.log("Took opposite corner", ai.token);
			}
			else
			{
				const free = corners.filter(c => {
					return board.at(c) === '';
				});
				// console.log("free", free);

				if (_.isEmpty(free) == false && free.some(tryMove))
				{
					console.log("Took a corner move", ai.token);
				}
				else
				{
					const edges = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }];
					if (edges.some(tryMove))
					{
						console.log("Took an edge move", ai.token);
					}
					else
					{
						console.error("Could not find a valid move");
						board.display(true);
					}
				}
			}
		}
	}
};


module.exports = class AIPlayer extends Player {
	constructor(options)
	{
		super(options);
		this.io = new AIEventIO();
		this.difficultly = 'expert';
		this.artifical = true;
		console.log(`Initialized AI Player ${this.id}`);

		this.io.on('game:update', (game) => {
			console.log("AI received game update");

			if (game.turn === this.id)
			{
				console.log("Is AI turn");
				setTimeout(this.takeTurn.bind(this), 500);
			}
		});
	}

	takeTurn()
	{
		console.log("AI is taking it's turn");
		// find the best place, based ont he AI difficultly level

		const brain = Brain[this.difficultly];

		brain(this, this.game.board, (location) => {
			// FIXME send grid
			const cell = location.x + location.y * 3;
			this.io.emit('place_token', { id: cell });
		});
	}

	serialize()
	{
		const data = super.serialize();
		data.artifical = this.artifical;
		return data;
	}
};