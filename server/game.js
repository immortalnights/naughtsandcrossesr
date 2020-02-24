const uuid = require('uuid/v1');


module.exports = class Game
{
	constructor(options)
	{
		this.id = uuid();
		this.players = [];
		this.cells = new Array(3 * 3).fill('');
		this.turn = 0;

		this.onClose = options.onClose;
	}

	place(player, cell)
	{
		console.log(`${player.id} placing ${player.token} in cell ${cell}`);

		const target = this.cells[cell];
		const activePlayer = this.players[this.turn];

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
				this.turn = this.nextTurn(this.turn);
				this.broadcast('next_turn', { turn: this.players[this.turn].token });
			}
		}
	}

	join(p, asHost)
	{
		console.log(`Game ${this.id} has ${this.players.length} players`);

		if (this.players.length < 2)
		{
			this.players.push(p);

			const tokens = ['x', 'o'];
			const token = tokens[this.players.length - 1];

			// update the new players game data
			p.joinedGame({ game: this, host: asHost, token });

			// tell all current players that a new player has joined
			this.broadcast('player_joined', { token: p.token });

			// tell the player they they have joined successfully
			p.io.emit('joined_game', { id: this.id, host: asHost, token: p.token });
			console.log(`Client ${p.id} has joined game ${this.id} (${this.players.length})`);

			if (this.players.length === 2)
			{
				console.log(`Starting game ${this.id}`);

				this.turn = this.players.findIndex((player) => { return player.token === 'x'; });

				this.broadcast('start_game', { cells: this.cells, turn: this.players[this.turn].token });
			}
		}
		else
		{
			console.log(`Game ${this.id} is full (${this.players.map((p) => p.id).join(', ')})`);
		}
	}

	leave(p)
	{
		const index = this.players.indexOf(p);
		if (index !== -1)
		{
			console.log(`Client ${p.id} has left game ${this.id} (${this.players.length})`);

			this.broadcast('end_game', { reason: "Opponent has left.", winner: false });
			this.close();
		}
		else
		{
			console.warn(`Client ${p.id} does not exist in game ${this.id}`);
		}
	}

	end(winner)
	{
		console.log("Game has ended. Winner", winner);
		if (winner === 'draw')
		{
			this.broadcast('end_game', { reason: `Game ended as a draw`, winner: false });
		}
		else
		{
			this.broadcast('end_game', { reason: `Player ${winner} has won`, winner: winner });
		}

		this.close();
	}

	close()
	{
		// kick all players
		this.players.forEach((p) => { p.endGame(); });

		// reset players
		this.players = [];

		// destroy game
		this.onClose(this);
	}

	broadcast(name, msg)
	{
		this.players.forEach((player) => {
			player.io.emit(name, msg)
		});
	}

	nextTurn(currentTurn)
	{
		console.debug(currentTurn, this.players.length);

		++currentTurn;
		if (currentTurn >= this.players.length)
		{
			currentTurn = 0;
		}

		console.debug(currentTurn);

		return currentTurn;
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
}
