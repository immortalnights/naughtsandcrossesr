const Player = require('./player');

module.exports = class HumanPlayer extends Player {
	constructor(options)
	{
		super(options);
		console.log(`Initialized Human Player ${this.id}`);
	}
};