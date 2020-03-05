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

const onCreateGame = (player) => {
	const game = new Game({ io });
	console.debug(`Created game ${game.id}`);
	return game;
}

const lobby = new Lobby({ io, onCreateGame });

io.on('connection', (client) => {
	console.log(`Client connected ${client.id}`);

	const player = new Player({ io: client });

	player.on('enter_game', () => {
		console.debug(`Player event 'enter_game'`);
		// remove player from lobby
		lobby.leave(player);
	});

	player.on('leave_game', () => {
		console.debug(`Player event 'leave_game'`);
		// add player to lobby
		lobby.join(player);
	});

	player.on('disconnect', () => {
		console.debug(`Player event 'disconnect'`);
		// remove player from lobby
		lobby.leave(player);
	});

	// auto join the lobby
	lobby.join(player);
});
