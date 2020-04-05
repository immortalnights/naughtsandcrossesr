import React, { useState } from 'react';
import { navigate } from 'hookrouter';
import ReactMatchmaking from 'react-matchmaking';

const LobbyWithLoader = ReactMatchmaking.LobbyWithLoader;

const Lobby = (props) => {
	const handleGameStarted = (id) => {
		navigate('/Game/' + id);
	};

	return (<LobbyWithLoader {...props} onGameReady={handleGameStarted} />)
};

export default Lobby;