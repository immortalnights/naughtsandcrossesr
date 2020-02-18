import React, { useState, useEffect } from 'react';
import Context from './Context.js';
// import openSocket from 'socket.io-client';
import { initSockets } from '../sockets/';

const SocketProvider = (props) => {
	const [value, setValue] = useState({
		game: null
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
