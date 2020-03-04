const uuid = require('uuid/v1');
const EventEmitter = require('events');

module.exports = class Player extends EventEmitter {
	constructor(options)
	{
		super();

		this.id = uuid();
		this.io = options.io;
		this.game = null;

		this.io.on('leave_game', this.onLeaveGame.bind(this));
		this.io.on('disconnect', this.onDisconnected.bind(this));
	}

	// serialize to JSON
	serialize()
	{
		return { id: this.id };
	}

	// send a message directly to this player
	send(name, msg)
	{
		this.io.emit(name, msg);
	}

	// entered a game
	onEnteredGame({ game, ...msg })
	{
		this.game = game;
		this.token = token;

		this.emit('enter_game');
	}

	// leave a game
	onLeaveGame()
	{
		console.assert(this.game, "Player is not in a game!");
		if (this.game)
		{
			this.game.leave(this);

			this.emit('leave_game');
		}

		this.game = null;
		this.token = null;
	}

	// disconnected
	onDisconnected()
	{
		// leave current game, without triggering the 'leave_game' event
		if (this.game)
		{
			this.game.leave(this);
			this.game = null;
		}

		this.emit('disconnected');
	}
}
