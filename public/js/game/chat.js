var socket = io();

function inputMessage() {
	var message = $("#chat-message").val();
	socket.emit('send-message', message);
	$("#chat-message").val("");
	return false;
}

function addChatMessage(username, message) {
	$('#chat-messages').append('<p><strong>' + username + ':</strong> ' + message + '</p>');
	scrollToBottom();
}

function addServerMessage(message) {
	$('#chat-messages').append('<p class="from-server">' + message + '</p>');
	scrollToBottom();
}

function scrollToBottom() {
	$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
}

socket.on('chat-message', function (data) {
	addChatMessage(data.user, data.message);
});

socket.on('server-message', function (data) {
	addServerMessage(data);
});
