import React from 'react';
import Context from '../../socketcontext/Context';
import { hostGame, joinGame } from '../../socketio/emits';
import './lobby.css';

class GamesList extends React.Component {
	render()
	{
		const onClickJoin = (event) => {
			joinGame(event.target.value);
		}

		const items = this.props.games.map((item) => {
			console.log("game", item);
			return (<div key={item.id} className="game-item flex-container">
				<div>Game {item.id}</div>
				<div>{item.players.length}</div>
				<div className="action-column"><button type="button" onClick={onClickJoin} name="join" value={item.id}>Join</button></div>
			</div>);
		});

		return (<div className="game-list">{items}</div>);
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

		return (<div className="lobby-container">
			<h4>Available Games</h4>
			<GamesList games={this.context.games} />
			<div className="controls" style={{textAlign: 'center'}}>
				<button className="button" onClick={this.onHost.bind(this)}>New Game</button>
			</div>
		</div>);
	}

	onHost()
	{
		hostGame()
	}
};
