import React, { useState, useEffect } from 'react';
import Context from './Context.js';
import { initSockets } from '../socketio/';

const SocketProvider = (props) => {
	const params = new URLSearchParams(window.location.search);

	const [value, setValue] = useState({
		state: 'DISCONNECTED',
		connected: false,
		ready: false,
		test: 1,
		games: [],
		players: [],
		game: params.get('game')
	});

	useEffect(() => initSockets({ setValue }), [initSockets]);

	return(
		<Context.Provider value={ value }>
			{ props.children }
		</Context.Provider>
	)
};

export default SocketProvider;
