const Server = require('react-matchmaking/server/server');
const NoughtsAndCrossesLobby = require('./lobby');
const NoughtsAndCrosses = require('./noughtsandcrosses');

const s = new Server({
	createLobby: options => new NoughtsAndCrossesLobby(options),
	createGame: options => new NoughtsAndCrosses(options)
});

s.start(3001);
