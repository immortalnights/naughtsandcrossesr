import { socket } from './index';

export const socketEvents = ({ setValue }) => {
	console.log("socketEvents", socket.id);

	socket.on('connect', () => {
		console.log("connected", socket.id);
		setValue(state => { return { ...state, state: 'CONNECTED' } });
	});

	socket.on('disconnect', () => {
		console.log("disconnected", socket.id);
		setValue(state => { return { ...state, game: null, token: null, state: 'DISCONNECTED' } });
	});

	socket.on('change_state', ({ state }) => {
		const playerState = state;
		console.log("change_state", socket.id, playerState);
		setValue(state => { return { ...state, state: playerState } });
	});

	socket.on('lobby_details', ({players, games}) => {
		console.log("lobby details: players", players, "games", games);
		setValue(state => { return { ...state, players, games } });
	});

	socket.on('lobby_player_joined', ({player}) => {
		console.log('lobby_player_joined', player);
		setValue(state => {
			state = { ...state };
			state.players = [...state.players];
			state.players.push(player);
			return state;
		});
	});

	socket.on('lobby_player_left', (player) => {
		console.log('lobby_player_left', player);
		setValue(state => {
			state = { ...state };
			state.players = [...state.players];
			const index = state.players.findIndex((p) => {
				return p.id === player.id;
			});
			state.players.splice(index, 1);
			return state
		});
	});

	socket.on('lobby_game_created', ({game}) => {
		console.log('lobby_game_created', game);
		setValue(state => {
			state = { ...state };
			state.games = [...state.games];
			state.games.push(game);
			return state;
		});
	});

	socket.on('lobby_game_updated', ({game}) => {
		console.log('lobby_game_updated', game);
		setValue(state => {
			state = { ...state };
			state.games = [...state.games];

			let index = state.games.findIndex((g) => { return g.id === game.id });
			state.games[index] = { ...state.games[index], game };

			return state;
		});
	});

	socket.on('lobby_game_closed', (game) => {
		console.log('lobby_game_closed', game);
		setValue(state => {
			state = { ...state };
			state.games = [...state.games];
			const index = state.games.findIndex((g) => {
				return g.id === game.id;
			});
			state.games.splice(index, 1);
			return state
		});
	});

	socket.on('game_created', ({ id, ...msg }) => {
		console.log("Created game", id, msg);
		setValue(state => { return { ...state, oldstate: 'JOINING_GAME' } });
	});

	socket.on('joined_game', ({ id, host, token, ...msg }) => {
		console.log("Joined game", id, host, token, msg);
		setValue(state => { return { ...state, game: id, token, host, oldstate: 'WAITING_FOR_OPPONENT' } });
	});

	socket.on('join_failed', ({ reason, ...msg }) => {
		console.log("Join game failed", reason);
		setValue(state => { return { ...state, reason, game: null, cells: null, oldstate: 'JOIN_FAILED' } });

		setTimeout(() => {
			setValue(state => {
				state = { ...state, oldstate: 'CONNECTED' };
				delete state.reason;
				delete state.winner;

				return state;
			});
		}, 2000);
	});

	socket.on('start_game', ({ cells, turn, ...msg }) => {
		console.log("Starting game", cells, turn, msg);
		setValue(state => {

			cells = cells.map((c, i) => { return { id: i, t: c }; });
			return { ...state, cells, turn, oldstate: 'PLAYING' }
		});
	});

	socket.on('end_game', ({ reason, winner, ...msg }) => {
		console.log("Ended game", reason, winner, msg);
		setValue(state => { return { ...state, reason, winner, game: null, cells: null, oldstate: 'ENDED' } });

		setTimeout(() => {
			setValue(state => {
				state = { ...state, oldstate: 'CONNECTED' };
				delete state.reason;
				delete state.winner;

				return state;
			});
		}, 2000);
	});

	socket.on('token_placed', ({ cell, token, ...msg }) => {
		console.log("token placed", cell, token);
		setValue(state => {
			state = { ...state };
			state.cells = { ...state.cells };
			state.cells[cell].t = token;
			return state;
		});
	});

	socket.on('next_turn', ({ turn, ...msg }) => {
		console.log("next turn", turn);
		setValue(state => { return { ...state, turn }; });
	});
};
