import React from 'react';
import Lobby from './components/lobby/';
import Menu from './components/menu/';
import Board from './components/board';
import Header from './components/header/';
import Context from './socketcontext/Context';
import { joinGame, leaveGame } from './socketio/emits';

export default class Game extends React.Component {
	static contextType = Context

	changeState(test)
	{
		this.setState(state => { return { ...state, test } });
	}

	render()
	{
		const state = this.context.state;

		// console.log(this.context.test);

		let content;
		switch (state)
		{
			case 'DISCONNECTED':
			{
				content = (<div>Connecting...</div>);
				break;
			}
			case 'CONNECTED':
			{
				// FIXME ideally, this would automatically change the state to joining, rather then render the joining component itself...
				if (this.context.game)
				{
					joinGame(this.context.game);
					content = (<p>Joining game...</p>);
				}
				else
				{
					content = (<Lobby changeState={this.changeState.bind(this)} />);
				}
				break;
			}
			case 'JOINING_GAME':
			{
				console.log("Joining game", this.context.autoJoin);
				content = (<p>Joining game...</p>);
				break;
			}
			case 'JOIN_FAILED':
			{
				content = (<div style={{textAlign: 'center'}}>
					<p>Failed to join game.</p>
					<p>{this.context.reason}</p>
				</div>);
				break;
			}
			case 'WAITING_FOR_OPPONENT':
			{
				if (this.context.host)
				{
					const onClick = () => {
						leaveGame();
					};
					const url = window.location.origin + '?game=' + this.context.game;
					content = (<div style={{textAlign: 'center'}}>
						<p>Waiting for opponent...</p>
						<p>Share <a href={url}>{url}</a> to get an oppenent</p>
						<button type="button" onClick={onClick.bind(this)}>Cancel</button>
					</div>);
				}
				else
				{
					content = (<p>Waiting for opponent...</p>);
				}
				break;
			}
			case 'PLAYING':
			{
				content = (<>
					<Header />
					<Board cells={this.context.cells} />
				</>);
				break;
			}
			case 'ENDED':
			{
				content = (<div style={{textAlign: 'center'}}>
					<p>Game ended.</p>
					<p>{this.context.reason}</p>
				</div>);
				break;
			}
			default:
			{
				content = (<p>Invalid state.</p>);
				break;
			}
		}

		return content;
	}
};
