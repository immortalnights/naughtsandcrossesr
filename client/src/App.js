import React from 'react';
import Context from './socketcontext/Context';
import Lobby from './components/lobby/';
import Game from './components/game/';
import { joinGame } from './socketio/emits';
import './App.css';

class App extends React.Component {
	static contextType = Context

	constructor(props)
	{
		super(props);
	}

	render()
	{
		const state = this.context.state;

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
				content = (<div>Joining lobby...</div>);
				break;
			}
			case 'IN_LOBBY':
			{
				// FIXME ideally, this would automatically change the state to joining, rather then render the joining component itself...
				if (this.context.game)
				{
					joinGame(this.context.game);
					content = (<p>Joining game...</p>);
				}
				else
				{
					content = (<Lobby />);
				}
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
			case 'JOINING_GAME':
			case 'IN_GAME_LOBBY':
			case 'PLAYING':
			case 'ENDED':
			{
				content = (<Game />);
				break;
			}
			default:
			{
				content = (<p>Invalid state "{state}".</p>);
				break;
			}
		}

		return content;
	}
}

export default App;
