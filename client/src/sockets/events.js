import { socket } from './index';

export const socketEvents = ({ setValue }) => {
	console.log("socketEvents", socket.id);

	socket.on('connect', () => {
		console.log("connected", socket.id);
		setValue(state => { return { ...state, connected: true } });
	});

	socket.on('disconnect', () => {
		console.log("disconnected", socket.id);
		setValue(state => { return { ...state, game: null, token: null, connected: false } });
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
