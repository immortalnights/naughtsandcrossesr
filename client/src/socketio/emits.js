import { socket } from './index';

export const hostGame = () => {
	socket.emit('host_game');

	// test - this shouldn't force the player into another game!
	// setTimeout(() => {
	// 	socket.emit('host_game');
	// }, 5000);
};

export const joinGame = (game) => {
	socket.emit('join_game', { id: game });
};

export const placeToken = (cell) => {
	socket.emit('place_token', { cell });
};
