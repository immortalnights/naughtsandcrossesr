import { socket } from "./index";

export const hostGame = () => {
	socket.emit('hostGame');
};

export const joinGame = (game) => {
	socket.emit('joinGame', { id: game });
};
