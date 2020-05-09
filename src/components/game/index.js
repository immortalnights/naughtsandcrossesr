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
		const { status, userId, winner, cells, board, emit } = this.props;
		const playerTurn = userId === this.props.turn;
		console.log("Render wrapper", this.props);

		const wrapperClass = ['board-wrapper'];

		if (this.props.status === 'FINISHED')
		{
			wrapperClass.push('game-over');
		}

		return (<>
			<Header userId={userId} status={status} playerTurn={playerTurn} winner={winner} />
			<div className={wrapperClass.join(' ')}>
				<Board game={this.props.type} cells={cells} cols={board.w} rows={board.h} emit={emit} />
			</div>
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