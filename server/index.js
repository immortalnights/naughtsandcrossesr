const http = require('http');
const SocketIO = require('socket.io');
const uuid = require('uuid/v1');
// const { hostedGame, joinedGame } = require('./socketio/emits');


const server = http.createServer();
const io = new SocketIO(server);

server.listen({
	port: 3001,
	host: '0.0.0.0'
});

let playerCount = 0;
const tokens = ['x', 'o'];

let games = [];

const findGameWithPlayer = (c) => {
	return games.find((g) => {
		console.debug(`Game ${g.id} has players ${g.players.map((p) => p.id).join(', ')}`)
		return g.players.includes(c);
	});
}

const hostGame = () => {
	const g = new Game();
	games.push(g);
	console.debug(`Created game ${g.id} (${games.length})`);
	return g;
}

const closeGame = (g) => {
	if (g.players.length === 0)
	{
		console.debug(`Game ${g.id} has no more players, removing game`);
		const index = games.indexOf(g);
		games.splice(index, 1);
	}
}

class Game {
	constructor()
	{
		this.id = uuid();
		this.players = [];
		this.cells = new Array(3 * 3).fill('');
		this.turn = 0;
	}

	place(player, cell)
	{
		console.log(`${player.id} placing ${player.token} in cell ${cell}`);

		const target = this.cells[cell];
		const activePlayer = this.players[this.turn];

		if (activePlayer !== player)
		{
			console.log("Invalid move: Not players turn");
			player.io.emit('invalid_move', { reason: "It is not your turn." });
		}
		else if (target)
		{
			console.log("Invalid move: Cell already taken");
			player.io.emit('invalid_move', { reason: "Cannot place token there." });
		}
		else
		{
			this.cells[cell] = player.token;

			// emit to all players
			this.players.forEach((p) => p.io.emit('token_placed', { cell, token: player.token }));

			const winner = this.checkForEndOfGame(this.cells);
			if (winner)
			{
				if (winner === 'draw')
				{
					this.players.forEach((p) => { p.endGame({ reason: `Game ended as a draw`, winner: false }); });
				}
				else
				{
					this.players.forEach((p) => { p.endGame({ reason: `Player ${winner} has won`, winner: winner }); });
				}
			}
			else
			{
				this.turn = this.nextTurn(this.turn);
			}
		}
	}

	join(p, asHost)
	{
		console.log(`Game ${this.id} has ${this.players.length} players`);

		if (this.players.length < 2)
		{
			this.players.push(p);

			const token = tokens[this.players.length - 1];

			// p.emit('joined', { status: 'Success', game: this.id, token: p.token, cells: this.cells, ready: this.players.length === 2 });
			p.joinedGame({ game: this, host: asHost, token });
			console.log(`Client ${p.id} has joined game ${this.id} (${this.players.length})`);

			if (this.players.length === 2)
			{
				console.log(`Starting game ${this.id}`);

				this.turn = this.players.findIndex((player) => { return player.token === 'x'; });

				this.players.forEach((player) => player.startGame(this.players[this.turn].token));
			}
		}
		else
		{
			console.log(`Game ${this.id} is full (${this.players.map((p) => p.id).join(', ')})`);
		}
	}

	leave(p)
	{
		const index = this.players.indexOf(p);
		if (index !== -1)
		{
			this.players.splice(index, 1);
			console.log(`Client ${p.id} has left game ${this.id} (${this.players.length})`);

			this.players.forEach((player) => player.endGame({ reason: "Opponent has left.", winner: false }));
		}
		else
		{
			console.warn(`Client ${p.id} does not exist in game ${this.id}`);
		}
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
}

class Player {
	constructor(io)
	{
		this.id = uuid();
		this.io = io;
		this.game = null;
		this.token = null;

		this.io.on('host_game', this.onHostGame.bind(this));
		this.io.on('join_game', this.onJoinGame.bind(this));
		this.io.on('place_token', this.onPlaceToken.bind(this));
		this.io.on('disconnect', this.onDisconnected.bind(this));
	}

	onHostGame()
	{
		if (this.game === null)
		{
			console.debug(`Client ${this.id} is hosting a new game`);

			const g = hostGame();
			this.io.emit('game_created', { id: g.id });
			g.join(this, true);
		}
		else
		{
			console.log(`Client attempted to host a new game while in a game`);
		}
	}

	joinedGame({ game, host, token })
	{
		this.game = game;
		this.host = host;
		this.token = token;

		this.io.emit('joined_game', { id: this.game.id, host: this.host, token: this.token });
	}

	startGame(turnToken)
	{
		this.io.emit('start_game', { cells: this.game.cells, turn: turnToken });
	}

	endGame({ ...msg })
	{
		this.game = null;
		this.host = undefined;
		this.token = null;

		this.io.emit('end_game', msg);
	}

	onJoinGame({ id, ...msg })
	{
		console.debug(`Client ${this.id} attempting to join ${id}`);

		const g = games.find((g) => {
			return g.id === id;
		});

		if (g)
		{
			g.join(this, false);
		}
		else
		{
			console.log(`Game ${id} does not exist`);
			this.io.emit('join_failed', { reason: "Game does not exist." });
		}
	}

	onPlaceToken({ cell, ...msg })
	{
		if (this.game)
		{
			this.game.place(this, cell);
		}
		else
		{
			console.warn("Player ${this.id} is not in a game");
		}
	}

	onDisconnected()
	{
		console.debug(`${this.id} disconnected`);

		const g = findGameWithPlayer(this);
		if (g)
		{
			g.leave(this);

			closeGame(g);
		}
		else
		{
			console.log(`Client ${this.id} wasn't in a game`);
		}
	}


// exports.hostedGame = function(socket, game) {
// }

// exports.joinedGame = function(player, game, host) {
// 	player.io.emit('joined_game', { id: game.id, host });
// }
}


io.on('connection', function(client) {
	console.log(`client connected`, client.id);

	const p = new Player(client);

	// client.on('hostGame', (msg, data) => {
	// 	console.log(`Client ${client.id} hosting a game`);
	// 	const g = new Game();
	// 	g.join(client);
	// 	games.push(g);
	// });

	// client.on('joinGame', (msg) => {
	// 	console.log(`Client ${client.id} joining ${msg.id}`);
	// 	const g = games.find((g) => {
	// 		return g.id === msg.id;
	// 	});

	// 	if (g)
	// 	{
	// 		g.join(client);
	// 	}
	// 	else
	// 	{
	// 		console.log(`Game ${msg.id} does not exist`);
	// 		client.emit('joined', { status: 'Failed', reason: "Game does not exist" });
	// 	}
	// });

	// client.on('message', (msg, data) => {
	// 	console.log(`received '${msg}'`);
	// 	switch (msg)
	// 	{
	// 		case 'load':
	// 		{
	// 			client.send('state', {
	// 				cells: cells,
	// 				observer: false
	// 			});
	// 			break;
	// 		}
	// 	}
	// });

	// client.on('disconnect', (q, w, e) => {
	// 	console.log(`client disconnected`, client.id);
	// 	const g = findGameWithPlayer(client);
	// 	if (g)
	// 	{
	// 		g.leave(client);

	// 		if (g.players.length === 0)
	// 		{
	// 			console.debug(`Game ${g.id} has no more players, removing game`);
	// 			const index = games.indexOf(g);
	// 			games = games.splice(index, 1);
	// 		}
	// 	}
	// 	else
	// 	{
	// 		console.log(`Client ${client.id} wasn't in a game`);
	// 	}
	// });
});
