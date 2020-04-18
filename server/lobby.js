const Lobby = require('react-matchmaking/server/lobby');
const { TeamFlags } = require('react-matchmaking/server/common');
const _ = require('underscore');

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
