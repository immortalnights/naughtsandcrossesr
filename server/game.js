


class Game
{
	constructor()
	{
		// this.id = uuid();
		this.cells = new Array(3 * 3).fill('');
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

		return winner;
	}
}

exports = Game;

let t = new Game();

const sets = [
	['', '', '',
	 '', '', '',
	 '', '', ''],
	['x', '', '',
	 '', 'x', '',
	 '', '', 'x'],
	['', '', 'x',
	 '', 'x', '',
	 'x', '', ''],
	['x', 'x', 'x', 
	 '', '', '',
	 '', '', ''],
	['', '', '',
	 'x', 'x', 'x',
	 '', '', ''],
	['', '', '',
	 '', '', '',
	 'x', 'x', 'x'],
	['x', '', '',
	 'x', '', '',
	 'x', '', ''],
	['', 'x', '',
	 '', 'x', '',
	 '', 'x', ''],
	['', '', 'x',
	 '', '', 'x',
	 '', '', 'x'],
	['', '', 'x',
	 '', '', 'o',
	 '', '', 'x'],
	['', '', 'x',
	 'o', 'o', 'o',
	 '', '', 'x'],
];

sets.forEach((s) => {
	const g = new Game();

	const result = g.checkForEndOfGame(s);
	if (result)
	{
		console.log("game over", result);
	}
	else
	{
		console.log("game is not over");
	}
});

