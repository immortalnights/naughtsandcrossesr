

const random = (min, max) => {
	return Math.floor(Math.random() * (max - min) ) + min;
};

const range = n => [...Array(n).keys()];

const pathArrayToString = paths => {
	return paths.map(p => p.map(i => {
		const t = i.token || '_';
		return `${t}-(${i.location.x}, ${i.location.y})`;
	}).join('; ')).join('\n');
}

module.exports ={
	random,
	range,
	pathArrayToString
};