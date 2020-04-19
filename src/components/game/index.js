import React from 'react';
import { A } from 'hookrouter';
import Board from '../../components/board';
import Header from '../../components/header/';
// import { leaveGame } from '../../socketio/emits';
import ReactMatchmaking from 'react-matchmaking';

const GameWithLoader = ReactMatchmaking.GameWithLoader;

class Wrapper extends React.Component {
	render()
	{
		return (<>
			<Header userId={this.props.userId} status={this.props.status} playerTurn={this.props.userId === this.props.turn} winner={this.props.winner} />
			<div className="board-wrapper {this.props.status === 'FINISHED' ? 'game-over' : ''}"><Board cells={this.props.cells} emit={this.props.emit} /></div>
			<div><A href="/">Leave Game</A></div>
		</>);
	}
}

export default class Game extends React.Component {
	render()
	{
		console.log("wrapper", this.context, this.props, this.props.userId);
		return (<GameWithLoader {...this.props} >
			{(game, emit) => (<Wrapper userId={this.props.userId} {...game} emit={emit} />)}
		</GameWithLoader>);
	}
}