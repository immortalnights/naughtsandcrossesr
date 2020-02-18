import React from 'react';
import { hostGame, joinGame } from './sockets/emits';
import './Menu.css';

export default class Game extends React.Component {
	render()
	{
		return (<div>
			<button className="button" onClick={this.onSinglePlayer.bind(this)}>Single Player</button>
			<button className="button" onClick={this.onHost.bind(this)}>Host</button>
			<button className="button" onClick={this.onJoin.bind(this)}>Join</button>
		</div>);
	}

	onSinglePlayer()
	{

	}

	onHost()
	{
		hostGame();
	}

	onJoin()
	{
		joinGame();
	}
};
