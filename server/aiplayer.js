const Player = require('./player');
const EventEmitter = require('events');

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

module.exports = class AIPlayer extends Player {
	constructor(options)
	{
		super(options);
		this.io = new AIEventIO();
		this.artifical = true;
		console.log(`Initialized AI Player ${this.id}`);

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

		const findEmptyCell = (cells) => {
			let ok = false;
			let cell = -1;
			while (!ok)
			{
				cell = Math.floor(Math.random() * 10) - 1;
				console.log("picked", cell);
				ok = cells[cell] === '';
			}

			return cell;
		};

		console.log(this.game.cells);
		const cell = findEmptyCell(this.game.cells);
		if (cell !== -1)
		{
			this.io.emit('place_token', { id: cell });
		}
		else
		{
			console.error("AI could not find a valid move");
		}

		return;
	}

	serialize()
	{
		const data = super.serialize();
		data.artifical = this.artifical;
		return data;
	}
};