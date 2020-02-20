import React from 'react';
import { hostGame, joinGame } from '../../socketio/emits';
import './Menu.css';

export default class Game extends React.Component {
	render()
	{
		return (<div>
			<button className="button" disabled onClick={this.onSinglePlayer.bind(this)}>Single Player</button>
			<button className="button" onClick={this.onHost.bind(this)}>Host</button>
			<button className="button" disabled onClick={this.onJoin.bind(this)}>Join</button>
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
