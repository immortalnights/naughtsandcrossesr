const http = require('http');
const SocketIO = require('socket.io');
const uuid = require('uuid/v1');

const server = http.createServer();

// const server = http.createServer();
const io = new SocketIO(server);

server.listen({
	port: 3001,
	host: '0.0.0.0'
});


let playerCount = 0;
const tokens = ['x', 'o'];

class Player {
	constructor(io) {
		this.io = io;

		if (playerCount < 2)
		{
			this.token = tokens[playerCount];
			this.observer = false;
		}
		else
		{
			this.observer = true;
		}
	}
}

class Game {
	constructor()
	{
		this.id = uuid();
		this.players = [];
		this.cells = new Array(3 * 3).fill('');
	}

	join(p)
	{
		this.players.push(p);

		p.token = tokens[this.players.length - 1];

		p.emit('joined', { status: 'Success', game: this.id, token: p.token, cells: this.cells, ready: this.players.length === 2 });
		console.log(`Client ${p.id} has joined game ${this.id}`);
	}

	leave(p)
	{
		const index = this.players.indexOf(p);
		if (index !== -1)
		{
			this.players = this.players.splice(index, 1);
			console.log(`Client ${p.id} has left game ${this.id}`);
		}
		else
		{
			console.warn(`Client ${p.id} does not exist in game ${this.id}`);
		}
	}
}

let games = [];

const findGameWithPlayer = (c) => {
	return games.find((g) => {
		console.debug(`Game ${g.id} has players ${g.players.map((p) => p.id).join(', ')}`)
		return g.players.includes(c);
	});
}

io.on('connection', function(client) {
	console.log(`client connected`, client.id);

	client.on('hostGame', (msg, data) => {
		console.log(`Client ${client.id} hosting a game`);
		const g = new Game();
		g.join(client);
		games.push(g);
	});

	client.on('joinGame', (msg) => {
		console.log(`Client ${client.id} joining ${msg.id}`);
		const g = games.find((g) => {
			return g.id === msg.id;
		});

		if (g)
		{
			g.join(client);
		}
		else
		{
			console.log(`Game ${msg.id} does not exist`);
			client.emit('joined', { status: 'Failed', reason: "Game does not exist" });
		}
	});

	client.on('message', (msg, data) => {
		console.log(`received '${msg}'`);
		switch (msg)
		{
			case 'load':
			{
				client.send('state', {
					cells: cells,
					observer: false
				});
				break;
			}
		}
	});

	client.on('disconnect', (q, w, e) => {
		console.log(`client disconnected`, client.id);
		const g = findGameWithPlayer(client);
		if (g)
		{
			g.leave(client);

			if (g.players.length === 0)
			{
				console.debug(`Game ${g.id} has no more players, removing game`);
				const index = games.indexOf(g);
				games = games.splice(index, 1);
			}
		}
		else
		{
			console.log(`Client ${client.id} wasn't in a game`);
		}
	});
});


// server.listen(3000);
