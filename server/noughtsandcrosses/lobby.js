const _ = require('underscore');
const Lobby = require('multiplayer-game-server/lobby');
const { TeamFlags } = require('multiplayer-game-server/common');

module.exports = class NoughtsAndCrossesLobby extends Lobby {
	constructor(options)
	{
		super(options);

		this.teams = [{
			id : 'X',
			maxPlayers: 1,
			name: 'X'
		}, {
			id : '0',
			maxPlayers: 1,
			name: '0'
		}];
		this.teamFlags = TeamFlags.Required;
	}
};
