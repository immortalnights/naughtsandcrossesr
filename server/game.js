const uuid = require('uuid/v1');

module.exports = class Game {
	constructor(options)
	{
		this.id = uuid();
		this.players = [];

		this.io = options.io;
		this.onClose = options.onClose;
	}

	serialize()
	{
		return { id: this.id, players: this.players.map(p => p.serialize()) };
	}

	join(p, asHost)
	{
		console.log(`Game ${this.id} has ${this.players.length} players`);

		if (this.players.length < 2)
		{
			this.players.push(p);

			const tokens = ['x', 'o'];
			const token = tokens[this.players.length - 1];

			p.io.join(this.id);

			// update the new players game data
			p.joinedGame({ game: this, host: asHost, token });

			// tell all current players that a new player has joined
			p.io.broadcast.to(this.id).emit('player_joined', { token: p.token });

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
		this.io.to(this.id).emit(name, msg);
	}

}
