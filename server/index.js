const Server = require('multiplayer-game-server/server');
const NoughtsAndCrosses = require('./noughtsandcrosses');
const Connect4 = require('./connect4');

const directory = {
	noughtsandcrosses: NoughtsAndCrosses,
	connectfour: Connect4
};

const s = new Server({
	createLobby: options => {
		options = options || {};
		options.game = 'noughtsandcrosses';
		return directory[options.game] ? new directory[options.game].Lobby(options) : null;
	},
	createGame: options => {
		options = options || {};
		options.game = 'connectfour';
		return directory[options.game] ? new directory[options.game].Game(options) : null;
	}
});

s.start(3001);
