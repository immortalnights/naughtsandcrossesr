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

		p.emit('joined', { game: this.id, token: p.token, cells: this.cells });
	}
}

let games = [];

const findGameWithPlayer = (c) => {
	return games.forEach((g) => {
		return g.players.contains(c);
	});
}

io.on('connection', (client) => {
	console.log(`client connected`);

	client.on('hostGame', (msg, data) => {
		console.log("Should host a game");
		const g = new Game();
		g.join(client);
		games.push(g);
	});

	client.on('joinGame', (msg, data) => {
		console.log("Should join a game");
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

	client.on('disconnect', () => {
		console.log(`client disconnected`);
		client
	});
});


// server.listen(3000);
