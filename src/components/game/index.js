import React from 'react';
// import Context from '../../socketcontext/Context';
import Board from '../../components/board';
import Header from '../../components/header/';
// import { leaveGame } from '../../socketio/emits';
import ReactMatchmaking from 'react-matchmaking';

const GameWithLoader = ReactMatchmaking.GameWithLoader;

class Wrapper extends React.Component {
	render()
	{
		return (<>
			<Header />
			<Board cells={this.props.cells} />
		</>);
	}
}

export default class Game extends React.Component {
	render()
	{
		console.log(this.context);
		return (<GameWithLoader {...this.props} >
			{(game, emit) => (<Wrapper {...game} emit={emit} />)}
		</GameWithLoader>);
	}
}