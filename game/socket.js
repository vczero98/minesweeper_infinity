module.exports = function(io, rooms) {
	io.on('connection', function (socket) {

		io.sockets.emit('server-message', getName() + " has joined the room.");

		socket.on('send-message', function(data) {
			console.log(getName() + ": " + data)
	  	io.sockets.emit('chat-message', {user: getName(), message: data});
		});

		socket.on('send-message', function(data) {
			console.log(getName() + ": " + data)
	  	io.sockets.emit('chat-message', {user: getName(), message: data});
		});

		socket.on('disconnect', function() {
			io.sockets.emit('server-message', getName() + " has left the room.");
		});

		function getName() {
			if (!socket.request.user.username) {
				return "Guest " + socket.handshake.session.guestNum;
			}
			return socket.request.user.username;
		}
	});
}
