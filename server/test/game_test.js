

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

