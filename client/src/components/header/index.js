import React from 'react';
import Context from '../../socketcontext/Context';

export default class Header extends React.Component {
	static contextType = Context

	render()
	{
		console.log(this.context.token, this.context.turn);
		const turn = this.context.token === this.context.turn ? "Your turn" : "Opponents Turn";
		return (<h2>{turn}</h2>)
	}
};
