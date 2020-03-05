const uuid = require('uuid/v1');

module.exports = class Lobby {
	constructor(options)
	{
		this.io = options.io;
		this.players = [];
		this.games = [];

		this.onCreateGame = options.onCreateGame;
	}

	serialize()
	{
		return {
			players: this.players.map(p => p.serialize()),
			games: this.games.map(g => g.serialize()),
		};
	}

	join(player)
	{
		console.log(`Player ${player.id} is joining the lobby`);

		// Add the lobby list
		this.players.push(player);

		// join the lobby channel
		player.io.join('lobby');

		player.setState('IN_LOBBY');

		// send the client all the games and players
		// this.broadcast('lobby_details', this.serialize());

		// inform existing players that a new player has joined
		player.io.to('lobby').emit('lobby_player_joined', {
			player: { id: player.id }
		});

		// listen to client socket events
		player.io.on('host_game', this.onHostGame.bind(this, player));
		player.io.on('join_game', this.onJoinGame.bind(this, player));
		// player.io.on('disconnect', this.onDisconnected.bind(this, player));
	}

	leave(player)
	{
		console.log(`Player ${player.id} is leaving the lobby`);

		player.io.leave('lobby');

		// inform all other players that a player has left
		player.io.to('lobby').emit('lobby_player_left', {
			id: player.id
		});

		// send the client all the games and players
		// this.broadcast('lobby_details', this.serialize());

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

	// close a game
	close(game)
	{
		console.debug(`Game ${game.id} is closing`);
		const index = this.games.indexOf(game);
		game.removeAllListeners('change');
		this.games.splice(index, 1);
		this.broadcast('lobby_game_closed', { id: game.id });
	}

	onHostGame(player)
	{
		console.debug(`Player ${player.id} attempting to host a new game`);

		const game = this.onCreateGame(player);
		game.on('change', function() {
			this.broadcast('lobby_game_updated', { game: this.serialize() });
		});

		this.games.push(game);
		this.broadcast('lobby_game_created', { game: game.serialize() });

		// this.leave(player);
		// game.join(player, true);
	}

	onJoinGame(player, { id })
	{
		console.debug(`Player ${player.id} attempting to join ${id}`);

		const game = this.games.find((g) => {
			return g.id === id;
		});

		if (game)
		{
			game.join(player, false);

			this.broadcast('lobby_details', this.serialize());
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
