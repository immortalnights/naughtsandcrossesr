import React, { useState } from 'react';
import { navigate } from 'hookrouter';
import ReactMatchmaking from 'react-matchmaking';
import './styles.css';

const LobbyBrowser = ReactMatchmaking.Browser;
const LobbyActions = ReactMatchmaking.Actions;

export default (props) => {
	let [selection, setSelection] = useState(null);

	const handleLobbySelected = (lobby) => {
		setSelection(lobby);
	};

	const joinGame = (id) => {
		if (id)
		{
			navigate('/Lobby/' + encodeURIComponent(selection.id));
		}
	}

	const handleJoinClick = () => {
		joinGame(selection);
	}

	const handleCreateClick = () => {
		return fetch('/api/lobby/', { method: 'post', headers: { 'X-USER-ID': props.userId } })
		.then((response) => {
			if (response.ok)
			{
				response.json().then(lobby => {
					// move the player into their lobby
					navigate('/Lobby/' + encodeURIComponent(lobby.id));
				});
			}
		});
	};

	return (<>
		<LobbyBrowser onSelect={handleLobbySelected} handleJoin={joinGame} />
		<LobbyActions selection={selection} handleJoinClick={handleJoinClick} handleCreateClick={handleCreateClick} />
	</>);
}