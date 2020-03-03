import React from 'react';
import Context from '../../socketcontext/Context';
import { hostGame, joinGame } from '../../socketio/emits';
import './lobby.css';

class GamesList extends React.Component {
	render()
	{
		const items = this.props.games.map((item) => {
			console.log("game", item);
			return (<div key={item.id}>
				<div>Game</div>
				<div><button type="button">Join</button></div>
			</div>);
		});

		return (<div>{items}</div>);
	}
}

export default class Lobby extends React.Component {
	static contextType = Context

	render()
	{
		const state = this.context.state;

		const update = () => {
			this.props.changeState(++this.context.test);
		}

		return (<>
			<div>
				<h4>Available Games</h4>
				<GamesList games={this.context.games} />
			</div>
			<div>
				<button className="button" onClick={this.onHost.bind(this)}>Host</button>
				<button className="button" onClick={update}>Test</button>
			</div>
		</>);
	}

	onHost()
	{
		hostGame()
	}
};
