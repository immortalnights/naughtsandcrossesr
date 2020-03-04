const Player = require('./player');

module.exports = class NaughtsAndCrossesPlayer extends Player {
	constructor(options)
	{
		super(options);

		this.token = null;
		this.io.on('place_token', this.onPlaceToken.bind(this));
	}


onPlaceToken({ cell, ...msg })
	{
		if (this.game)
		{
			this.game.place(this, cell);
		}
		else
		{
			console.warn(`Player ${this.id} is not in a game`);
		}
	}
}
