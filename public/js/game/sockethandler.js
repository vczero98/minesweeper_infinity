function SocketHandler(chatHandler, socket, playersManager, board, renderer) {
	// this.socket = io();
	// this.chatHandler = chatHandler;
	var self = this;
	board.useSocketHandler(self);

	socket.on('new-player', function (player) {
		chatHandler.addServerMessage(player.username + " has joined the room.");
		playersManager.addOtherPlayer(player);
		displayPlayersNeeded();
	});

	socket.on('player-left', function (username) {
		chatHandler.addServerMessage(username + " has left the room.");
		playersManager.removePlayer(username);
		displayPlayersNeeded();
	});

	socket.on('chat-message', function (data) {
		chatHandler.addChatMessage(data.user, data.message);
	});

	socket.on('server-message', function (data) {
		chatHandler.addServerMessage(data);
	});

	socket.on('all-players', function (data) {
		playersManager.setMaxPlayers(data.maxPlayers);
		playersManager.createTable();
		data.players.forEach(function(player) {
			playersManager.addOtherPlayer(player);
		});
		playersManager.setMe(data.me);
		playersManager.addPlayerToTable(playersManager.getMe());
		displayPlayersNeeded();
	});

	socket.on('board-state', function(data) {
		board.getBlocks().setState(data);
		renderer.drawBoard();
	});

	socket.on('color-change', function (data) {
		var span = $("#players-table ." + data.oldColor);
		span.removeClass(data.oldColor);
		span.addClass(data.newColor);
		var player = playersManager.getPlayerByUsername(data.username);
		player.color = data.newColor;
	});

	socket.on('flag-block', function (data) {
		board.flagBlock(data.x, data.y, data.username);
	});

	socket.on('unflag-block', function (data) {
		board.removeFlag(data.x, data.y, data.username);
	});

	socket.on('block-expanded', function (data) {
		playersManager.getTableHandler().updateExpanded(data.username, data.n);
	});

	socket.on('update-world', function (data) {
		board.updateWorld(data.updates);
	});

	socket.on('item-radar', function (data) {
		board.giveRadarInfo(data.radarRange);
	});

	socket.on('disconnect', function (data) {
		window.location.href = "/rooms";
	});

	function displayPlayersNeeded() {
		var n = playersManager.getPlayersNeeded();
		var plural = (n === 1) ? "" : "s";
		var str = "Waiting for " + n + " more player" + plural + "...";
		$('#game-display p').text(str);
	}

	function flagBlock(x, y) {
		socket.emit('flag-block', {x: x, y: y});
	}

	function expandBlock(x, y) {
		socket.emit("expand-block", {x: x, y: y});
	}

	function useItem(id, x, y) {
		socket.emit("use-item", {id: id, x: x, y: y});
	}

	this.flagBlock = flagBlock;
	this.expandBlock = expandBlock;
	this.useItem = useItem;
}
