const uuid = require('uuid/v1');
const BasePlayer = require('react-matchmaking/server/player');
const EventEmitter = require('events');

class OldPlayer extends EventEmitter {
	constructor(options)
	{
		super();

		this.id = uuid();
		this.io = options.io;
		this.state = 'CONNECTED';
		this.game = null;

		this.io.on('leave_game', this.onLeaveGame.bind(this));
		this.io.on('disconnect', this.onDisconnected.bind(this));
	}

	// serialize to JSON
	serialize()
	{
		return { id: this.id };
	}

	setState(state)
	{
		console.debug(`${this.id} ${this.state} => ${state}`);
		this.state = state;
		this.io.emit('change_state', { state });
	}

	// send a message directly to this player
	send(name, msg)
	{
		this.io.emit(name, msg);
	}

	// entered a game
	enteredGame({ game, ...msg })
	{
		this.game = game;
		this.emit('enter_game');

		this.setState('IN_GAME_LOBBY');
	}

	// leave a game
	onLeaveGame()
	{
		console.assert(this.game, `Player ${this.id} is not in a game!`);
		if (this.game)
		{
			this.game.leave(this);

			this.emit('leave_game');
		}

		this.game = null;
		this.setState('IN_LOBBY');
	}

	// disconnected
	onDisconnected()
	{
		this.state = 'DISCONNECTED';

		// leave current game, without triggering the 'leave_game' event
		if (this.game)
		{
			this.game.leave(this);
			this.game = null;
		}

		this.emit('disconnected');
	}
}


module.exports = class Player extends BasePlayer {
	constructor(options)
	{
		super(options);
		this.token = options.team === 'X' ? 'X' : '0';
		this.status = 'PENDING';
		this.game = options.ref;
	}

	serialize()
	{
		const data = super.serialize();
		data.status = this.status;
		data.token = this.token;
		return data;
	}
}