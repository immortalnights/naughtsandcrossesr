import React from 'react';
import Menu from './Menu';
import Board from './Board';
import Context from './socketio/Context';

export default class Game extends React.Component {
	static contextType = Context

	render()
	{
		const isConnected = this.context.connected;

		let content;
		if (isConnected !== true)
		{
			content = (<div>Connecting...</div>);
		}
		else if (!this.context.game)
		{
			content = (<Menu />);
		}
		else if (this.context.ready !== true)
		{
			const url = window.location.origin + '?game=' + this.context.game;
			content = (<div>
				<p>Waiting for opponent...</p>
				<p>Share <a href={url}>{url}</a> to get an oppenent</p>
			</div>);
		}
		else
		{
			content = (<Board cells={this.context.cells} />);
		}

		return content;
	}
};
