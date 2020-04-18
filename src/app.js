import React, { useState, useEffect } from 'react';
import { usePath, navigate, useRoutes, A } from 'hookrouter';
import ReactMatchmaking from 'react-matchmaking';
import Browser from './components/browser/';
import Lobby from './components/lobby/';
import Game from './components/game/';
import './app.css';

const GameWithLoader = ReactMatchmaking.GameWithLoader;

const routes = {
	'/': () => ({userId}) => (<Browser userId={userId} />),
	'/Lobby/:id': ({id}) => ({userId}) => (<Lobby userId={userId} id={id} />),
	'/Game/:id': ({id}) => ({userId}) => (<Game userId={userId} id={id} ></Game>)
}

function RouteContent(props) {
	const route = useRoutes(routes);
	return route ? route({ userId: props.userId }) : (<h1>404</h1>);
}

function App() {
	let path = usePath();
	const Route = useRoutes(routes);
	const [userId, setUserId] = useState(null);
	const [registrationResponse, setRegistrationResponse] = useState(null);

	useEffect(() => {
		if (!userId)
		{
			fetch('/api/register', { method: 'put' }).then((response) => {
				if (response.ok)
				{
					response.json()
					.then((data) => {
						console.log("Registered", data.userId);
						setUserId(data.userId);
					})
					.catch(() => {
						setRegistrationResponse("Failed to parse JSON response. Refresh to try again.");
					});
				}
				else
				{
					setRegistrationResponse("Failed to register user. Refresh to try again.");
				}
			});
		}
	});

	let content;
	if (userId)
	{
		content = (<Route userId={userId} />);
	}
	else
	{
		if (registrationResponse)
		{
			content = (<div>{registrationResponse}</div>);
		}
		else if (path === '/')
		{
			content = (<div>Registering, please wait...</div>);
		}
		else
		{
			navigate('/');
		}
	}

	return (
		<>
			<header className="header">
				<h1>Noughts and Crosses<small>Multiplayer Matchmaking powered by React</small></h1>
			</header>
			<main>{content}</main>
			<footer></footer>
		</>
	);
}

export default App;
