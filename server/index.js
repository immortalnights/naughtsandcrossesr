const Lobby = require('./lobby');
const Player = require('./player');
const Game = require('./game');

const lobby = new Lobby({
	player: Player,
	game: Game
});

lobby.start();
