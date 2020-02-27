import { socket } from './index';

export const hostGame = () => {
	socket.emit('host_game');
};

export const joinGame = (game) => {
	socket.emit('join_game', { id: game });
};

export const leaveGame = (game) => {
	socket.emit('leave_game');
};

export const placeToken = (cell) => {
	socket.emit('place_token', { cell });
};
