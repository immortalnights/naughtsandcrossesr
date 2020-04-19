import React, { useState } from 'react';
import { navigate } from 'hookrouter';
import _ from 'underscore';
import ReactMatchmaking from 'react-matchmaking';
import './styles.css';

const PlayerSlot = props => {
	console.log("slot", props);

	const className = ['player-slot'];

	if (props.readyState)
	{
		className.push('slot-player-ready');
	}
	else
	{
		className.push('slot-player-not-ready');
	}

	switch (props.player)
	{
		case 'None':
		{
			className.push('slot-empty');
			break;
		}
		case 'Local':
		{
			className.push('slot-taken');
			className.push('slot-local-player');
			break;
		}
		case 'Remote':
		{
			className.push('slot-taken');
			break;
		}
	}

	let hostOptions;
	if (props.isHost)
	{
		hostOptions = (<div>
			<div>
				<button type="button" className="btn btn-primary">Select</button>
			</div>
			
		</div>);
	}

	const clickWrapper = (func, ...args) => {
		return event => { func(event, ...args); }
	}

	return (<div>
		<div className={className.join(' ')} onClick={clickWrapper(props.onClickSlot, props)}>
			<h2>{props.name}</h2>
			<h3>{props.local ? "You" : "Opponent"}</h3>
			{hostOptions}
		</div>
		<div className="slot-host-controls">{props.isHost && (props.local !== true) && props.player !== 'None' ? (<button type="button" className="btn btn-link" onClick={clickWrapper(props.onKickPlayer, props)}>Kick</button>) : ''}</div>
	</div>);
};

const PlayerDisplay = props => {
	// console.log("playerDisplay props", props);
	const thisPlayer = props.players.find(p => props.player === p.id);

	const handleSelectSlot = (event, slot) => {
		console.log("handleSelectSlot", slot);
		if (props.isHost)
		{
			props.onSelectSlot({ playerId: thisPlayer.id, team: slot.name });
		}
	};

	const handleKickPlayer = (event, slot) => {
		console.log("handleKickPlayer", slot);
		if (props.isHost && slot.local !== true)
		{
			props.onKickPlayer({ playerId: slot.player.id });
		}
	};

	const slots = {
		X: {
			name: 'X',
			player: 'None',
			local: undefined,
			readyState: false,
			isHost: props.isHost,
			onClickSlot: handleSelectSlot,
			onKickPlayer: handleKickPlayer
		},
		0: {
			name: '0',
			player: 'None',
			readyState: false,
			isHost: props.isHost,
			onClickSlot: handleSelectSlot,
			onKickPlayer: handleKickPlayer
		}
	};

	props.players.forEach(p => {
		const thisPlayer = (props.player === p.id);

		const slot = slots[p.team];
		slot.player = _.pick(p, 'id', 'name');
		slot.local = thisPlayer ? true : false;
		slot.readyState = p.ready;
	});

	return (<>
		<div className="slot-wrapper"><PlayerSlot {...slots['X']} /></div>
		<div className="slot-wrapper"><PlayerSlot {...slots['0']} /></div>
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