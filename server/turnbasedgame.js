const Game = require('./game');

module.exports = class TurnBased extends Game {
	constructor(options)
	{
		super(options);

		this.turn = 0;
	}

	nextTurn(currentTurn)
	{
		console.debug(currentTurn, this.players.length);

		++currentTurn;
		if (currentTurn >= this.players.length)
		{
			currentTurn = 0;
		}

		console.debug(currentTurn);

		return currentTurn;
	}
}
