const TurnBasedGame = require('react-matchmaking/server/turnbasedgame');
const HumanPlayer = require('./humanplayer');
const AIPlayer = require('./aiplayer');

module.exports = class NoughtsAndCrosses extends TurnBasedGame {
	constructor(options)
	{
		super(options);
		this.cells = new Array(3 * 3).fill('');

		console.log(`NoughtsAndCrosses ${this.id} initialized`);
	}

	getNewPlayerToken()
	{
		return ['X', '0'][this.players.length];
	}

	handleHumanJoin(playerData)
	{
		const player = new HumanPlayer({
			id: playerData.id,
			io: playerData.client,
			token: this.getNewPlayerToken(),
			ref: this
		});

		this.handleJoin(player);
		return player;
	}

	handleAIJoin(player)
	{
		const ai = new AIPlayer({
			id: player.id,
			token: this.getNewPlayerToken(),
			ref: this
		});

		this.handleJoin(ai);
		return ai;
	}

	handleJoin(player)
	{
		super.handleJoin(player);

		player.on('place_token', (cell) => {
			console.debug("place", player.id, player.id, cell, cell.id)
			this.place(player, cell.id);
		});
	}

	begin()
	{
		this.status = 'PLAYING';
		this.nextTurn();
		console.log("send game to all players");
		this.broadcast('game:update', this.serialize());
	}

	place(player, cell)
	{
		console.log(`${player.id} placing ${player.token} in cell ${cell} (${this.status})`);

		const target = this.cells[cell];
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
		else if (target)
		{
			console.log("Invalid move: Cell already taken");
			player.io.emit('invalid_move', { reason: "Cannot place token there." });
		}
		else
		{
			this.cells[cell] = player.token;

			// emit to all players
			// this.broadcast('token_placed', { cell, token: player.token });

			const winner = this.checkForEndOfGame(this.cells);
			if (winner)
			{
				this.status = 'FINISHED';
				this.turn = undefined;


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

	checkForEndOfGame(cells)
	{
		const wins = [
			[1, 0, 0,
			 0, 1, 0,
			 0, 0, 1],
			[0, 0, 1,
			 0, 1, 0,
			 1, 0, 0],
			[1, 1, 1,
			 0, 0, 0,
			 0, 0, 0],
			[0, 0, 0,
			 1, 1, 1,
			 0, 0, 0],
			[0, 0, 0,
			 0, 0, 0,
			 1, 1, 1],
			[1, 0, 0,
			 1, 0, 0,
			 1, 0, 0],
			[0, 1, 0,
			 0, 1, 0,
			 0, 1, 0],
			[0, 0, 1,
			 0, 0, 1,
			 0, 0, 1],
		];

		let winner = null;
		wins.some((set) => {
			// console.log(set);
			let token = undefined;
			const hasWinner = set.every((cell, index) => {
				// console.log(cell, index);
				let r = false;
				if (!cell)
				{
					r = true;
				}
				else if (!token && cells[index])
				{
					token = cells[index];
					// console.log(index, '=>', token);
					r = true;
				}
				else if (token && cells[index] === token)
				{
					// console.log(index, '=>', token);
					r = true;
				}

				return r;
			});

			if (hasWinner)
			{
				winner = token;
			}

			return hasWinner;
		});

		if (!winner)
		{
			const full = cells.every((c) => !!c);
			if (full)
			{
				winner = 'draw';
				console.log(`Board is full`);
			}
		}

		return winner;
	}

	serialize()
	{
		const data = super.serialize();
		data.cells = this.cells;
		data.winner = this.winner;
		return data;
	}
};
