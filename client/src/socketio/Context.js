import React from 'react';

const SocketIOContext = React.createContext({
	connected: false,
	game: null
});

export default SocketIOContext;
