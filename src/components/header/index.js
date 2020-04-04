import React from 'react';
import Context from '../../socketcontext/Context';

export default class Header extends React.Component {
	static contextType = Context

	render()
	{
		let content;
		if (this.props.status === 'PLAYING')
		{
			content = (<><h2>{this.props.playerTurn ? "Your turn" : "Opponents Turn"}</h2><h3>&nbsp;</h3></>);
		}
		else
		{
			let summary;
			if (this.props.winner)
			{
				if (this.props.winner === this.props.userId)
				{
					summary = "You Won";
				}
				else
				{
					summary = "You Lost";
				}
			}
			else
			{
				summary = "Draw";
			}

			content = (
				<>
					<h2>Game Over</h2>
					<h3>{summary}</h3>
				</>
			);
		}

		return content;
	}
};
