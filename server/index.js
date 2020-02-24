const http = require('http');
const SocketIO = require('socket.io');
const uuid = require('uuid/v1');
const Game = require('./game');

const server = http.createServer();
const io = new SocketIO(server);

server.listen({
	port: 3001,
	host: '0.0.0.0'
});

let games = [];

const findGameWithPlayer = (c) => {
	return games.find((g) => {
		console.debug(`Game ${g.id} has players ${g.players.map((p) => p.id).join(', ')}`)
		return g.players.includes(c);
	});
}

const hostGame = () => {
	const closeGame = (g) => {
		console.debug(`Game ${g.id} has no more players, removing game`);
		const index = games.indexOf(g);
		games.splice(index, 1);
	}

	const g = new Game({ onClose: closeGame });
	games.push(g);
	console.debug(`Created game ${g.id} (${games.length})`);
	return g;
}

class Player {
	constructor(io)
	{
		this.id = uuid();
		this.io = io;
		this.game = null;
		this.token = null;

		this.io.on('host_game', this.onHostGame.bind(this));
		this.io.on('join_game', this.onJoinGame.bind(this));
		this.io.on('leave_game', this.onLeaveGame.bind(this));
		this.io.on('place_token', this.onPlaceToken.bind(this));
		this.io.on('disconnect', this.onDisconnected.bind(this));
	}

	onHostGame()
	{
		if (this.game === null)
		{
			console.debug(`Client ${this.id} is hosting a new game`);

			const g = hostGame();
			this.io.emit('game_created', { id: g.id });
			g.join(this, true);
		}
		else
		{
			console.log(`Client attempted to host a new game while in a game`);
		}
	}

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

	onJoinGame({ id, ...msg })
	{
		console.debug(`Client ${this.id} attempting to join ${id}`);

		const g = games.find((g) => {
			return g.id === id;
		});

		if (g)
		{
			g.join(this, false);
		}
		else
		{
			console.log(`Game ${id} does not exist`);
			this.io.emit('join_failed', { reason: "Game does not exist." });
		}
	}

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


io.on('connection', function(client) {
	console.log(`client connected`, client.id);

	const p = new Player(client);
});
