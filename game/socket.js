module.exports = function(io, roomsHandler) {
	io.on('connection', function (socket) {
		var requestGranted = false;

		var roomid;
		var room;
		var username;
		var player;

		if (!socket.handshake.session) {
			// Connected user doesn't have a session

		} else {
			roomid = socket.handshake.session.roomid;
			room = roomsHandler.getRoomById(roomid);

			if (room.players.length >= room.maxPlayers) {
				// If room is full
				socket.disconnect();
			} else {
				requestGranted = true;
				socket.join(roomid);
				username = getName();
				socket.emit('all-players', room.players);
				player = {username: username,  color: room.availableColors.pop()};
				room.players.push(player);
				io.to(roomid).emit('new-player', player);
			}
		}

		socket.on('send-message', function(data) {
			console.log(username + ": " + data)
			io.to(roomid).emit('chat-message', {user: username, message: data});
		});

		socket.on('chat-command', function(data) {
			if (data.command === "color" || data.command === "colour") {
				var color = data.parameter.toLowerCase();
				var index = room.availableColors.indexOf(color)
				if (index > -1) {
					var oldColor = player.color;
					room.availableColors.splice(index, 1)
					room.availableColors.push(player.color);
					player.color = color;
					socket.emit('server-message', "Changed color to " + color + ".");
					io.to(roomid).emit('color-change', {oldColor: oldColor, newColor: color});
				} else {
					socket.emit('server-message', "Color is not available.");
				}
			} else {
				socket.emit('server-message', "Chat command not found");
			}

		});

		socket.on('disconnect', function() {
			if (requestGranted) {
				socket.broadcast.to(roomid).emit('player-left', player);

				var index = room.players.indexOf(player);
				if (index > -1) {
					room.players.splice(index, 1);
					room.availableColors.push(player.color);
				}
			}
		});

		function getName() {
			if (!socket.request.user.username) {
				return "Guest " + socket.handshake.session.guestNum;
			}
			return socket.request.user.username;
		}
	});
}
