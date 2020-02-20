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
				state = { ...state, state: 'CONNECTED' }
				delete state.reason;
				delete state.winner;

				return state;
			});
		}, 2000);
	});

	socket.on('start_game', ({ cells, ...msg }) => {
		console.log("Starting game", msg);
		setValue(state => { return { ...state, cells, state: 'PLAYING' } });
	});

	socket.on('end_game', ({ reason, winner, ...msg }) => {
		console.log("Ended game", reason, winner, msg);
		setValue(state => { return { ...state, reason, winner, game: null, cells: null, state: 'ENDED' } });

		setTimeout(() => {
			setValue(state => {
				state = { ...state, state: 'CONNECTED' }
				delete state.reason;
				delete state.winner;

				return state;
			});
		}, 2000);
	});

	socket.on('joined', ({ status, ...msg }) => {
		console.log("joined", status);
		switch (status)
		{
			case 'Success':
			{
				const { game, token, ready } = msg;
				setValue(state => {
					state = { ...state, game, token, ready };
					delete state.error;
					delete state.autoJoin;
					return state;
				});
				break;
			}
			case 'Failed':
			default:
			{
				setValue(state => {
					state = { ...state, error: msg.reason, game: null, token: null, ready: false };
					delete state.autoJoin;
					return state;
				});
				break;
			}
		}
	});
};
