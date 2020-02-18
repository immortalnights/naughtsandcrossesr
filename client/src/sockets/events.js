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

	socket.on('joined', ({ game, token, cells }) => {
		console.log("joined", game, token);
		setValue(state => { return { ...state, game, token, ready: false } });
	});

	socket.on('positionInLine', ({ positionInLine }) => {
		setValue(state => { return { ...state, positionInLine } });
	});
};
