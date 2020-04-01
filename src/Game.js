import React from 'react';
import Lobby from './components/lobby/';
import Menu from './components/menu/';
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
	}
};
