import React, { useState, useEffect } from 'react';
import Context from './Context.js';
// import openSocket from 'socket.io-client';
import { initSockets } from '../sockets/';

const SocketProvider = (props) => {
	const params = new URLSearchParams(window.location.search);

	const [value, setValue] = useState({
		connected: false,
		ready: false,
		game: null,
		autoJoin: params.get('game')
	});

	useEffect(() => initSockets({ setValue }), [initSockets]);

	return(
		<Context.Provider value={ value }>
			{ props.children }
		</Context.Provider>
	)
};

export default SocketProvider;

// export default class SocketIOProvider extends React.Component {
//  static contextType = Context

//  render()
//  {
//    return (<Context.Provider value={{}}>
//        {this.props.children}
//      </Context.Provider>);
//  }
// }
