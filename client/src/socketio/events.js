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

	socket.on('game_created', ({ id, ...msg }) => {
		console.log("Created game", id, msg);
		setValue(state => { return { ...state, state: 'JOINING_GAME' } });
	});

	socket.on('joined_game', ({ id, host, token, ...msg }) => {
		console.log("Joined game", id, host, token, msg);
		setValue(state => { return { ...state, game: id, token, host, state: 'WAITING_FOR_OPPONENT' } });
	});

	socket.on('join_failed', ({ reason, ...msg }) => {
		console.log("Join game failed", reason);
		setValue(state => { return { ...state, reason, game: null, cells: null, state: 'JOIN_FAILED' } });

		setTimeout(() => {
			setValue(state => {
				state = { ...state, state: 'CONNECTED' };
				delete state.reason;
				delete state.winner;

				return state;
			});
		}, 2000);
	});

	socket.on('start_game', ({ cells, ...msg }) => {
		console.log("Starting game", cells, msg);
		setValue(state => {

			cells = cells.map((c, i) => { return { id: i, t: c }; });
			return { ...state, cells, state: 'PLAYING' }
		});
	});

	socket.on('end_game', ({ reason, winner, ...msg }) => {
		console.log("Ended game", reason, winner, msg);
		setValue(state => { return { ...state, reason, winner, game: null, cells: null, state: 'ENDED' } });

		setTimeout(() => {
			setValue(state => {
				state = { ...state, state: 'CONNECTED' };
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
};
