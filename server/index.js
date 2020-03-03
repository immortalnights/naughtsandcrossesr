const http = require('http');
const SocketIO = require('socket.io');

const Lobby = require('./lobby');
const Player = require('./player');
const Game = require('./game');


const server = http.createServer();
const io = new SocketIO(server);

server.listen({
	port: 3001,
	host: '0.0.0.0'
});

const lobby = new Lobby({io});

io.on('connection', (client) => {
	console.log(`Client connected ${client.id}`);

	const player = new Player(client);
	lobby.join(player);
});

// maybe lobby.'host_game'?
lobby.host = function() {
	const game = new Game({ onClose: this.close.bind(this), io: this.io });
	console.debug(`Created game ${game.id} (${this.games.length})`);
	return game;
}
