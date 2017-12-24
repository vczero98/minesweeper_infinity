function ChatHandler() {

}

ChatHandler.prototype.inputMessage = function(message, socket) {
	console.log(message);
	if (message.length > 0) {
		if (message.substring(0,1) === "/") {
			if (message.length > 1) {
				if (message.includes(" ")) {
					var spaceIndex = message.indexOf(" ");
					var command = message.substring(1, spaceIndex);
					var parameter = message.substring(spaceIndex + 1, message.length);
					socket.emit('chat-command', {command: command, parameter: parameter});
				} else {
					var command = message.substring(1, message.length)
					socket.emit('chat-command', {command: command, parameter: ""});
				}
			}
		} else {
			socket.emit('send-message', message);
		}
	}
}

ChatHandler.prototype.addChatMessage = function(username, message) {
	$('#chat-messages').append('<p><strong>' + username + ':</strong> ' + message + '</p>');
	this.scrollToBottom();
}

ChatHandler.prototype.addServerMessage = function(message) {
	$('#chat-messages').append('<p class="from-server">' + message + '</p>');
	this.scrollToBottom();
}


ChatHandler.prototype.addPlayerToTable = function(player) {
	var emptyRow = $("#players-table .empty-row").first();
	emptyRow.removeClass("empty-row");
	emptyRow.addClass("player");
	emptyRow.empty();
	emptyRow.append('<td><span class="player-color ' + player.color + '"></span><span class="username">' + player.username + '</span></td>');
	emptyRow.append('<td><i class="fa fa-flag" aria-hidden="true"></i> 0</td>');
	emptyRow.append('<td><i class="fa fa-square-o" aria-hidden="true"></i> 0</td>');
}

ChatHandler.prototype.removePlayerFromTable = function(data) {
	var row = $("#players-table span:contains('" + data.username + "')").parent().parent();
	row.remove();
	$("#players-table tbody").append('<tr class="empty-row"><td class="empty-place">empty</td></tr>');
}

ChatHandler.prototype.scrollToBottom = function() {
	$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
}
