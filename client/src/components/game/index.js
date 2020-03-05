import React from 'react';
import Context from '../../socketcontext/Context';
import Board from '../../components/board';
import Header from '../../components/header/';
import { leaveGame } from '../../socketio/emits';

export default class Game extends React.Component {
	static contextType = Context

	render()
	{
		const state = this.context.state;

		const onClickLeave = () => {
			leaveGame();
		};

		let content;
		switch (state)
		{
			case 'JOINING_GAME':
			{
				console.log("Joining game", this.context.autoJoin);
				content = (<p>Joining game...</p>);
				break;
			}
			case 'IN_GAME_LOBBY':
			{
				if (this.context.host)
				{
					const url = window.location.origin + '?game=' + this.context.game;
					content = (<div style={{textAlign: 'center'}}>
						<p>Waiting for opponent...</p>
						<p>Share <a href={url}>{url}</a> to get an oppenent</p>
						<button type="button" onClick={onClickLeave.bind(this)}>Cancel</button>
					</div>);
				}
				else
				{
					content = (<div style={{textAlign: 'center'}}>
						<p>Waiting for opponent...</p>
						<button type="button" onClick={onClickLeave.bind(this)}>Cancel</button>
					</div>);
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
}