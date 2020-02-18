import React from 'react';
import Game from './Game';
import SocketIOProvider from './socketio/';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="flex-container flex-center">
				<SocketIOProvider>
					<Game />
				</SocketIOProvider>
			</div>
		);
	}
}

export default App;
