var socket = io();

function inputMessage() {
	var message = $("#chat-message").val();
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


function addPlayerToTable(player) {
	var emptyRow = $("#players-table .empty-row").first();
	emptyRow.removeClass("empty-row");
	emptyRow.addClass("player");
	emptyRow.empty();
	emptyRow.append('<td><span class="player-color ' + player.color + '"></span><span class="username">' + player.username + '</span></td>');
	emptyRow.append('<td><i class="fa fa-flag" aria-hidden="true"></i> 0</td>');
	emptyRow.append('<td><i class="fa fa-square-o" aria-hidden="true"></i> 0</td>');
}

function removePlayerFromTable(data) {
	var row = $("#players-table span:contains('" + data.username + "')").parent().parent();
	row.remove();
	$("#players-table tbody").append('<tr class="empty-row"><td class="empty-place">empty</td></tr>');
}

function scrollToBottom() {
	$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
}

socket.on('new-player', function (data) {
	addServerMessage(data.username + " has joined the room.");
	addPlayerToTable(data);
});

socket.on('player-left', function (data) {
	addServerMessage(data.username + " has left the room.");
	removePlayerFromTable(data);
	// addPlayerToTable(data.username);
});

socket.on('chat-message', function (data) {
	addChatMessage(data.user, data.message);
});

socket.on('server-message', function (data) {
	addServerMessage(data);
});

socket.on('all-players', function (data) {
	data.forEach(function(player) {
		addPlayerToTable(player);
	});
});

socket.on('color-change', function (data) {
	var span = $("#players-table ." + data.oldColor);
	span.removeClass(data.oldColor);
	span.addClass(data.newColor);
});


socket.on('disconnect', function (data) {
	window.location.href = "/rooms";
});
