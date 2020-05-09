const _ = require('underscore');
const TurnBasedGame = require('multiplayer-game-server/turnbasedgame');
const Grid = require('multiplayer-game-server/grid');
const ConnectFourGame = require('connectfour-ai-arena/game');
const HumanPlayer = require('../humanplayer');
const AIPlayer = require('../aiplayer');


class ConnectFour extends TurnBasedGame {
	constructor(options)
	{
		super(options);
		this.initHumanPlayer = options => new HumanPlayer(options);
		this.initComputerPlayer = options => new AIPlayer(options);
		this.type = 'connectfour';
		this.board = new Grid(7, 6);

		console.log(`ConnectFour ${this.id} initialized`);
	}

	onPlayerJoined(player)
	{
		if (player.token === 'X')
		{
			player.token = 'red';
		}
		else
		{
			player.token = 'yellow';
		}

		player.on('place_token', (cell) => {
			console.debug("place", player.id, player.id, cell, cell.id)
			this.place(player, cell.id);
		});
	}

	begin()
	{
		this.status = 'PLAYING';
		this.players.forEach(p => console.log(p.team, p.token));
		this.turn = this.players.findIndex(p => p.team === 'X');
		this.broadcast('game:update', this.serialize());
	}

	place(player, cell)
	{
		console.log(`${player.id} placing ${player.token} in cell ${cell} (${this.status})`);

		const activePlayer = this.whichPlayer();

		if (this.status !== 'PLAYING')
		{
			console.log("Invalid move: Game is not playing");
		}
		else if (activePlayer !== player)
		{
			console.log("Invalid move: Not players turn");
			player.io.emit('invalid_move', { reason: "It is not your turn." });
		}
		else
		{
			const placeToken = (cell, token) => {
				const location = {
					x: cell % this.board.width,
					y: 0
				};
				console.log(`cell ${cell} to x ${location.x}`)

				let ok;

				// drop placement down Y
				const testLocation = { x: location.x, y: 0 };
				if (this.board.at(testLocation) !== '')
				{
					this.board.display();
					console.error(`Failed to place token at ${testLocation.x}, ${testLocation.y}: Column is full`);
					console.error(`Board: '${this.board.serialize()}'`);
				}
				else
				{
					for (let y = this.board.height - 1; y >= 0 && !ok; y--)
					{
						const dropLocation = { x: location.x, y };
						console.debug("drop", dropLocation);
						if (this.board.at(dropLocation) === '')
						{
							ok = this.board.place(dropLocation, token);
						}
					}
				}

				return ok;
			};


			if (placeToken(cell, player.token) === false)
			{
				console.log("Invalid move: Cell already taken");
				player.io.emit('invalid_move', { reason: "Cannot place token there." });
			}
			else
			{
				const winner = this.checkForEndOfGame();
				if (winner)
				{
					this.end();

					let winningPlayer = this.players.find(p => p.token === winner);
					if (winningPlayer)
					{
						this.winner = winningPlayer.id;
					}
					else
					{
						this.winner = '';
					}
				}
				else
				{
					this.nextTurn();
				}

				this.broadcast('game:update', this.serialize());
			}
		}
	}

	checkForEndOfGame(board)
	{
		board = board || this.board;
		// console.log("checkForEndOfGame");
		// console.log(this.board.display());

		let winner = null;

		const paths = board.paths(4);
		const winPath = paths.find(path => {
			// Use the first token to match against the rest
			const token = path[0].token;

			return path.every(cell => cell.token === token);
		});

		if (_.isEmpty(winPath) === false)
		{
			winner = winPath[0].token;
		}
		else
		{
			const cells = board.toArray();
			const full = cells.every((c) => !!c);
			if (full)
			{
				winner = 'draw';
			}
		}

		return winner;
	}

	serialize()
	{
		const data = { ...super.serialize(),
			type: this.type,
			board: { w: this.board.width, h: this.board.height },
			cells: this.board.toArray(),
			winner: this.winner
		};
		return data;
	}
};

ConnectFour.prototype.checkForEndOfGame = ConnectFourGame.prototype.checkForEndOfGame;

module.exports = ConnectFour;