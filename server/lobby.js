const uuid = require('uuid/v1');

module.exports = class Lobby {
	constructor(options)
	{
		this.io = options.io;
		this.players = [];
		this.games = [];
	}

	join(player)
	{
		// Add the lobby list
		this.players.push(player);

		// join the lobby channel
		player.io.join('lobby');

		// send the client all the games and players
		player.io.emit('lobby_details', {
			players: this.players.map(p => { return { id: p.id }; }),
			games: this.games.map(g => { return { id: g.id }; }),
		});

		// inform existing players that a new player has joined
		player.io.to('lobby').emit('lobby_player_joined', {
			player: { id: player.id }
		});

		// listen to client socket events
		player.io.on('host_game', this.onHostGame.bind(this, player));
		player.io.on('join_game', this.onJoinGame.bind(this, player));
		player.io.on('disconnect', this.onDisconnected.bind(this, player));
	}

	leave(player)
	{
		console.log(`Player ${player.id} is leaving the lobby`);

		// inform all other players that a player has left
		player.io.to('lobby').emit('lobby_player_left', {
			id: player.id
		});

		player.io.leave('lobby');

		// stop listening to client socket events
		player.io.removeAllListeners('host_game');
		player.io.removeAllListeners('join_game');
		player.io.removeAllListeners('disconnect');

		const index = this.players.indexOf(player);
		this.players.splice(index, 1);
	}

	findGameWithPlayer(player)
	{
		return this.games.find((game) => {
			console.debug(`Game ${game.id} has players ${game.players.map((p) => p.id).join(', ')}`);
			return game.players.includes(player);
		});
	}

	// host a game
	// host()
	// {
	// 	const game = new this.Game({ onClose: this.close.bind(this), io: this.io });
	// 	this.games.push(game);
	// 	console.debug(`Created game ${game.id} (${this.games.length})`);
	// 	return game;
	// }

	// close a game
	close(game)
	{
		console.debug(`Game ${game.id} is closing`);
		const index = this.games.indexOf(game);
		this.games.splice(index, 1);
		this.broadcast('lobby_game_closed', { id: game.id });
	}

	onHostGame(player)
	{
		console.debug(`Player ${player.id} attempting to host a new game`);

		const game = this.host();
		this.games.push(game);
		this.broadcast('lobby_game_created', { game: { id: game.id } });

		this.leave(player);
		game.join(player, true);
	}

	onJoinGame(player, { id })
	{
		console.debug(`Player ${this.id} attempting to join ${id}`);

		const game = this.games.find((g) => {
			return g.id === id;
		});

		if (game)
		{
			this.leave(player);
			game.join(player, false);
		}
		else
		{
			console.log(`Game ${id} does not exist`);
			player.send('join_failed', { reason: "Game does not exist." });
		}
	}

	onDisconnected(player)
	{
		this.leave(player);
	}

	broadcast(name, msg)
	{
		this.io.to('lobby').emit(name, msg);
	}
}