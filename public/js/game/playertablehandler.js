function PlayerTableHandler(numPlayers) {
	var numPlayers = numPlayers;
	var players = [];
	for (var i = 0; i < numPlayers; i++) {
		$("#players-table tbody").append('<tr><td class="empty-place">empty</td></tr>');
	}

	function resetPosition(n) {
		players[n] = {color: "", username: "", flags: 0, expanded: 0};
	}

	function addPlayer(player) {
		players.push({color: player.color, username: player.username, flags: player.nFlags, expanded: player.nExpanded});
		updateTableRow(players.length - 1);
		return;
	}

	function removePlayer(username) {
		var n = findPlayer(username);
		if (n === -1)
			return;

		players.splice(n, 1);
		$("#players-table tr")[n].remove();
		$("#players-table tbody").append('<tr><td class="empty-place">empty</td></tr>');
	}

	function findPlayer(username) {
		for (var i = 0; i < players.length; i++) {
			if (players[i] && players[i].username === username) {
				return i;
			}
		}
		return -1;
	}

	function updateTableRow(i) {
		var row = $("#players-table tr:nth-child(" + (i + 1) + ")");
		row.empty();
		row.removeClass();

		var player = players[i];
		if (player) {
			row.addClass("player");
			row.append('<td><span class="player-color ' + player.color + '"></span><span class="username">' + player.username + '</span></td>');
			row.append('<td><i class="fa fa-flag" aria-hidden="true"></i> <span class="flags">' + player.flags + '</span></td>');
			row.append('<td><i class="fa fa-square-o" aria-hidden="true"></i> <span class="expanded">' + player.expanded + '</span></td>');
		} else {
			row.addClass("empty");
			row.append('<td class="empty-place">empty</td>');
		}
	}

	function updateFlags(username, n) {
		var playerNum = findPlayer(username);
		if (playerNum > -1) {
			players[playerNum].flags = n;
			var span = $("#players-table tr:nth-child(" + (playerNum + 1) + ") span.flags");
			span.text(n);
		}
	}

	function updateExpanded(username, n) {
		var playerNum = findPlayer(username);
		if (playerNum > -1) {
			players[playerNum].expanded = n;
			var span = $("#players-table tr:nth-child(" + (playerNum + 1) + ") span.expanded");
			span.text(n);
		}
		if (!playersArrayInOrder()) {
			players.sort(comparePlayers);
			for (var i = 0; i < players.length; i++) {
				updateTableRow(i);
			}
		}
	}

	function incrementFlags(username) {
		var playerNum = findPlayer(username);
		if (playerNum > -1) {
			updateFlags(username, players[playerNum].flags + 1);
		}
	}

	function decrementFlags(username) {
		var playerNum = findPlayer(username);
		if (playerNum > -1) {
			updateFlags(username, players[playerNum].flags - 1);
		}
	}

	function incrementExpanded(username) {
		var playerNum = findPlayer(username);
		if (playerNum > -1) {
			updateExpanded(username, players[playerNum].expanded + 1);
		}
	}

	function playersArrayInOrder() {
		for (var i = 0; i < (players.length - 1); i++) {
			if (comparePlayers(players[i], players[i + 1]) === 1)
				return false;
		}
		return true;
	}

	function comparePlayers(player1, player2) {
		if (player1.expanded < player2.expanded) return 1;
		if (player1.expanded > player2.expanded) return -1;
		return 0;
	}

	this.addPlayer = addPlayer;
	this.removePlayer = removePlayer;
	this.updateFlags = updateFlags;
	this.updateExpanded = updateExpanded;
	this.incrementFlags = incrementFlags;
	this.decrementFlags = decrementFlags;
	this.incrementExpanded = incrementExpanded;
}
