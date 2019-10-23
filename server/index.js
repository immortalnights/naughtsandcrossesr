const http = require('http');
const SocketIO = require('socket.io');

const server = http.createServer();

// const server = http.createServer();
const io = new SocketIO(server);

server.listen({
	port: 3001,
	host: '0.0.0.0'
});


const cells = new Array(3 * 3).fill('');

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

io.on('connection', (client) => {
	console.log(`client connected`);

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
});
io.on('disconnection', (client) => {
	console.log(`client disconnected`);

	
});

// server.listen(3000);
