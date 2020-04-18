const _ = require('underscore');
const Vector2D = require('./vector2d');

module.exports = class Grid
{
	constructor(options)
	{
		if (options instanceof Object)
		{
			this.width = options.x || options.width;
			this.height = options.y || options.height;
		}
		else
		{
			this.width = arguments[0];
			this.height = arguments[1];
		}

		this.data = [];

		// build the grid
		for (let y = 0; y < this.height; y++)
		{
			const row = []
			for (let x = 0; x < this.width; x++)
			{
				row.push('');
			}

			this.data.push(row);
		}

		this.center = { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) };
		this.corners = [
			{ x: 0, y: 0 },
			{ x: this.width - 1, y: 0 },
			{ x: 0, y: this.height - 1 },
			{ x: this.width - 1, y: this.height - 1 },
		];
		this.directions = [
			// { x: -0, y: -1 },
			{ x: +1, y: -1 },
			{ x: +1, y: -0 },
			{ x: +1, y: +1 },
			{ x: -0, y: +1 }
			// { x: -1, y: +1 },
			// { x: -1, y: -0 },
			// { x: -1, y: -1 }
		];
	}

	toArray()
	{
		let values = [];
		for (let y = 0; y < this.height; y++)
		{
			for (let x = 0; x < this.width; x++)
			{
				values.push(this.at({ x, y }) || '');
			}
		}

		return values;
	}

	clone()
	{
		c = new Grid(this.width, this.height);
		this.c = this.data;
		return c;
	}

	display(log)
	{
		let str = '';
		for (let y = 0; y < this.height; y++)
		{
			const row = [];
			for (let x = 0; x < this.width; x++)
			{
				row.push(this.at({ x, y }) || ' ');
			}

			str += ' ' + row.join(' | ') + '\n';
		}

		if (log)
		{
			console.log(str);
		}

		return str;
	}

	place(location, token)
	{
		console.assert(arguments.length === 2, "Must provide two arguments, location and token");
		console.assert(_.isNumber(location.x) && _.isNumber(location.y), "location argument must have numeric x and y attributes");
		console.assert(token !== undefined && token !== null, "Token must be a value");

		let ok = false;
		if (this.at(location) === '')
		{
			const { x, y } = { ...location };
			this.data[location.y][location.x] = token;
			ok = true;
		}
		else
		{
			console.error(`Cannot place '${token}' at (${location.x}, ${location.y}): Invalid location`);
		}

		return ok;
	}

	at(location)
	{
		return this.isValid(location) ? this.data[location.y][location.x] : undefined;
	};

	isValid(location)
	{
		return location && (location.x >= 0 && location.x < this.width && location.y >= 0 && location.y < this.height);
	}

	// 
	move(location, direction)
	{
		const nextLocation = { x: location.x + direction.x, y: location.y + direction.y };
		return nextLocation;
	}

	paths(length)
	{
		length = length || Math.min(this.width, this.height);

		const paths = [];
		for (let y = 0; y < this.height; y++)
		{
			for (let x = 0; x < this.width; x++)
			{
				this.directions.forEach(direction => {
					// console.log("start", x, y, "direction", direction);
					const start = new Vector2D({ x, y });
					let location = start.clone();
					let tokens = {};
					let cont = true;
					// let end;
					let path = [];

					do
					{
						const tokenAtLocation = this.at(location);

						if (tokenAtLocation)
						{
							if (tokens[tokenAtLocation])
							{
								tokens[tokenAtLocation] += 1;
							}
							else
							{
								tokens[tokenAtLocation]  = 1;
							}
						}

						path.push({ location: location.clone(), token: tokenAtLocation });
						location = location.add(direction);
					} while (this.isValid(location) && path.length < length);

					// isValid(end)
					if (path.length === length && path.every(item => (item.token === '')) === false)
					{
						paths.push(path);
					}
				});
			}
		}

		return paths;
	}

	pathLength(start, direction, match)
	{
		const check = (location) => {
			let ok = false;
			if (this.isValid(location))
			{
				ok = match ? (this.at(location) === match) : (this.at(location) !== undefined);
			}

			return ok;
		};

		let location = Vector2D.make(start);
		direction = direction instanceof Vector2D ? direction : Vector2D.make(direction);
		let size = 0;
		while (check(location))
		{
			size++;

			location = location.add(direction);
		}

		return size;
	}
};