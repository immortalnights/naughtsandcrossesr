const uuid = require('uuid/v1');
const EventEmitter = require('events');


module.exports = class Game extends EventEmitter {
	constructor(options)
	{
		super();
		this.id = uuid();
		this.players = [];
		this.maxPlayers = options.maxPlayers || null;
		this.minPlayers = null;
		this.state = 'waiting_for_players';

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

		if (this.maxPlayers === null || players.length < this.maxPlayers)
		{
			this.players.push(p);

			// add the player to the game io room
			p.io.join(this.id);

			// update the new players game data
			p.enteredGame({ game: this });

			// tell all current players that a new player has joined
			p.io.broadcast.to(this.id).emit('player_joined', p.serialize());

			// tell the player they they have joined successfully
			p.io.emit('joined_game', p.serialize());
			console.log(`Client ${p.id} has joined game ${this.id} (${this.players.length})`);

			this.emit('change');
		}
		else
		{
			console.log(`Game ${this.id} is full (${this.players.map((p) => p.id).join(', ')})`);
		}
	}

	leave(player)
	{
		const index = this.players.indexOf(player);
		if (index !== -1)
		{
			console.log(`Client ${player.id} has left game ${this.id} (${this.players.length})`);

			this.remove(player);

			this.emit('change');

			if (this.minPlayers !== null && this.players.length < this.minPlayers)
			{
				this.broadcast('end_game', { reason: "Opponents has left.", winner: false });
				this.close();
			}
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

	remove(player)
	{
		const index = this.players.indexOf(player);
		if (index !== -1)
		{
			// take the player out of the game
			this.players.splice(index, 1);

			// remove the player the game io room
			player.io.leave(this.id);

			// notify all players that a player has left
			this.broadcast('player_left', player.serialize());
		}
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
