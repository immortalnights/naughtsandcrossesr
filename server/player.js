const uuid = require('uuid/v1');

module.exports = class Player {
	constructor(io)
	{
		this.id = uuid();
		this.io = io;
		this.game = null;
		this.token = null;

		this.io.on('leave_game', this.onLeaveGame.bind(this));
		this.io.on('place_token', this.onPlaceToken.bind(this));
	}

	send(name, msg)
	{
		this.io.emit(name, msg);
	}

	// onHostGame()
	// {
	// 	if (this.game === null)
	// 	{
	// 		console.debug(`Client ${this.id} is hosting a new game`);

	// 		const g = hostGame();
	// 		this.io.emit('game_created', { id: g.id });
	// 		g.join(this, true);
	// 	}
	// 	else
	// 	{
	// 		console.log(`Client attempted to host a new game while in a game`);
	// 	}
	// }

	joinedGame({ game, host, token })
	{
		this.game = game;
		this.host = host;
		this.token = token;
	}

	startGame()
	{
	}

	endGame()
	{
		this.game = null;
		this.host = undefined;
		this.token = null;
	}

	// onJoinGame({ id, ...msg })
	// {
	// 	console.debug(`Client ${this.id} attempting to join ${id}`);

	// 	const g = games.find((g) => {
	// 		return g.id === id;
	// 	});

	// 	if (g)
	// 	{
	// 		g.join(this, false);
	// 	}
	// 	else
	// 	{
	// 		console.log(`Game ${id} does not exist`);
	// 		this.io.emit('join_failed', { reason: "Game does not exist." });
	// 	}
	// }

	onLeaveGame()
	{
		if (this.game)
		{
			this.game.leave(this);
		}
	}

	onPlaceToken({ cell, ...msg })
	{
		if (this.game)
		{
			this.game.place(this, cell);
		}
		else
		{
			console.warn(`Player ${this.id} is not in a game`);
		}
	}

	onDisconnected()
	{
		console.debug(`${this.id} disconnected`);

		if (this.game)
		{
			this.game.leave(this);
		}
		else
		{
			console.log(`Client ${this.id} wasn't in a game`);
		}
	}
}