const TurnBasedGame = require('react-matchmaking/server/turnbasedgame');

module.exports = class NoughtsAndCrosses extends TurnBasedGame {
	constructor(options)
	{
		super(options);
		this.cells = new Array(3 * 3).fill('');

		console.log(`NoughtsAndCrosses ${this.id} initialized`);
	}

	begin()
	{
		this.nextTurn();
	}

	checkForEndOfGame(cells)
	{
		const wins = [
			[1, 0, 0,
			 0, 1, 0,
			 0, 0, 1],
			[0, 0, 1,
			 0, 1, 0,
			 1, 0, 0],
			[1, 1, 1,
			 0, 0, 0,
			 0, 0, 0],
			[0, 0, 0,
			 1, 1, 1,
			 0, 0, 0],
			[0, 0, 0,
			 0, 0, 0,
			 1, 1, 1],
			[1, 0, 0,
			 1, 0, 0,
			 1, 0, 0],
			[0, 1, 0,
			 0, 1, 0,
			 0, 1, 0],
			[0, 0, 1,
			 0, 0, 1,
			 0, 0, 1],
		];

		let winner = null;
		wins.some((set) => {
			// console.log(set);
			let token = undefined;
			const hasWinner = set.every((cell, index) => {
				// console.log(cell, index);
				let r = false;
				if (!cell)
				{
					r = true;
				}
				else if (!token && cells[index])
				{
					token = cells[index];
					// console.log(index, '=>', token);
					r = true;
				}
				else if (token && cells[index] === token)
				{
					// console.log(index, '=>', token);
					r = true;
				}

				return r;
			});

			if (hasWinner)
			{
				winner = token;
			}

			return hasWinner;
		});

		if (!winner)
		{
			const full = cells.every((c) => !!c);
			if (full)
			{
				winner = 'draw';
				console.log(`Board is full`);
			}
		}

		return winner;
	}

	serialize()
	{
		const data = super.serialize();
		data.cells = this.cells;
		return data;
	}
};
