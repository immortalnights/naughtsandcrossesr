const _ = require('underscore');
const EventEmitter = require('events');
const Brains = require('noughtsandcrossesbattle/brains');
const Player = require('./player');


class AIEventIO extends EventEmitter
{
	join()
	{
		// No-op for AI players
		console.debug("AISocket:join");
	}

	leave()
	{
		// No-op for AI players
		console.debug("AISocket:leave");
	}
};

class AIPlayer extends Player {
	constructor(options)
	{
		super(options);
		this.io = new AIEventIO();
		this.difficultly = options.difficultly;
		this.brain = Brains[options.difficultly] ? new Brains[difficultly](this, {}) : new Brains['learning'](this, {});
		this.artifical = true;

		console.log(`Initialized AI Player ${this.id} ${this.difficultly} ${Brains}`);

		this.io.on('game:update', (game) => {
			console.log("AI received game update");

			if (game.turn === this.id)
			{
				console.log("Is AI turn");
				setTimeout(this.takeTurn.bind(this), 500);
			}
		});
	}

	takeTurn()
	{
		console.log("AI is taking it's turn");
		// find the best place, based ont he AI difficultly level

		const grid = this.game.board;
		const location = this.brain.run(this, grid);
		this.io.emit('place_token', { id: grid.toCell(location) });
	}

	serialize()
	{
		const data = super.serialize();
		data.artifical = this.artifical;
		return data;
	}
};

module.exports = AIPlayer;