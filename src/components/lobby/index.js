import React, { useState } from 'react';
import { navigate } from 'hookrouter';
import ReactMatchmaking from 'react-matchmaking';
import './styles.css';

const PlayerSlot = props => {
	console.log("slot", props);

	const className = ['player-slot'];
	switch (props.state)
	{
		case 'Empty':
		{
			className.push('slot-empty');
			break;
		}
		case 'Owned':
		{
			className.push('slot-taken');
			className.push('slot-local-player');
			break;
		}
		case 'Taken':
		{
			className.push('slot-taken');
			break;
		}
	}

	return (<div className={className.join(' ')}>
		<h2>{props.name}</h2>
		{props.isHost ? (<button type="button">Select</button>) : ''}
	</div>);
};

const PlayerDisplay = props => {
	// console.log("playerDisplay props", props);
	const thisPlayer = props.players.find(p => props.player === p.id);

	let slotXState = 'Empty';
	let slot0State = 'Empty';

	props.players.forEach(p => {
		const thisPlayer = (props.player === p.id);

		if (p.team === 'X')
		{
			slotXState = thisPlayer ? 'Owned' : 'Taken';
		}
		else if (p.team === '0')
		{
			slot0State = thisPlayer ? 'Owned' : 'Taken';
		}
	});

	const handleSelectSlot = (slot) => {
		console.log("select slot")
		if (props.isHost)
		{
			props.onSelectSlot(slot);
		}
	};

	return (<>
		<div className="slot-wrapper" onClick={() => { handleSelectSlot('X') }}><PlayerSlot name="X" state={slotXState} isHost={props.isHost} /></div>
		<div className="slot-wrapper" onClick={() => { handleSelectSlot('0') }}><PlayerSlot name="0" state={slot0State} isHost={props.isHost} /></div>
	</>);
}

const Lobby = (props) => {
	// console.log("Lobby props", props);
	const handleGameStarted = (id) => {
		navigate('/Game/' + id);
	};

	return (<ReactMatchmaking.LobbyWithLoader {...props} playerDisplay={PlayerDisplay} onGameReady={handleGameStarted} />)
};

export default Lobby;