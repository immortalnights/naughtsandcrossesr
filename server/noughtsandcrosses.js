const TurnBasedGame = require('react-matchmaking/server/turnbasedgame');

module.exports = class NoughtsAndCrosses extends TurnBasedGame {
	constructor(options)
	{
		super(options);
		this.cells = new Array(3 * 3).fill('');

		console.log(`NoughtsAndCrosses ${this.id} initialized`);
	}

	handleJoin(player)
	{
		super.handleJoin(player);

		player.token = this.players.length === 1 ? 'X' : '0';

		player.on('place_token', (cell) => {
			console.log(player, player.id, cell, cell.id)
			this.place(player, cell.id);
		});
	}

	begin()
	{
		this.nextTurn();
	}

	place(player, cell)
	{
		console.log(`${player.id} placing ${player.token} in cell ${cell}`);

		const target = this.cells[cell];
		const activePlayer = this.whichPlayer();

		if (activePlayer !== player)
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
			this.broadcast('token_placed', { cell, token: player.token });

			const winner = this.checkForEndOfGame(this.cells);
			if (winner)
			{
				this.end(winner);
			}
			else
			{
				this.nextTurn();
				this.broadcast('next_turn', { turn: this.whichPlayer().token });
			}
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
		return data;
	}
};
