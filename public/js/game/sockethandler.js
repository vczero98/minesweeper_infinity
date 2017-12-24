function SocketHandler(chatHandler, socket, playersManager, board) {
	// this.socket = io();
	// this.chatHandler = chatHandler;
	var self = this;

	socket.on('new-player', function (player) {
		chatHandler.addServerMessage(player.username + " has joined the room.");
		chatHandler.addPlayerToTable(player);
		playersManager.addOtherPlayer(player);
	});

	socket.on('player-left', function (player) {
		chatHandler.addServerMessage(player.username + " has left the room.");
		chatHandler.removePlayerFromTable(player);
		playersManager.removePlayer(player);
	});

	socket.on('chat-message', function (data) {
		chatHandler.addChatMessage(data.user, data.message);
	});

	socket.on('server-message', function (data) {
		chatHandler.addServerMessage(data);
	});

	socket.on('all-players', function (data) {
		data.players.forEach(function(player) {
			chatHandler.addPlayerToTable(player);
			playersManager.addOtherPlayer(player);
			console.log(player);
		});
		playersManager.setMe(data.me);
		chatHandler.addPlayerToTable(playersManager.getMe());
	});

	socket.on('color-change', function (data) {
		var span = $("#players-table ." + data.oldColor);
		span.removeClass(data.oldColor);
		span.addClass(data.newColor);
		var player = playersManager.getPlayerByUsername(data.username);
		player.color = data.newColor;
	});

	socket.on('flag-block', function (data) {
		console.log(data.x, data.y);
		console.log("flagging player color: " + data.color);
		board.flagBlock(data.x, data.y, data.color);
	});

	socket.on('disconnect', function (data) {
		window.location.href = "/rooms";
	});


	function flagBlock(x, y) {
		socket.emit('flag-block', {x: x, y: y});
	}

	SocketHandler.prototype.flagBlock = flagBlock;
}
