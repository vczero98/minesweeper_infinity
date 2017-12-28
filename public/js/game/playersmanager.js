function PlayersManager() {
	var otherPlayers = [];
	var me;
	var maxPlayers;

	function addOtherPlayer(player) {
		otherPlayers.push(player);
	}

	function removePlayer(player) {
		otherPlayers.splice(otherPlayers.indexOf(player), 1);
	}

	function setMe(player) {
		me = player;
	}

	function getMe() {
		return me;
	}

	function getPlayerByUsername(username) {
		if (me.username === username) {
			return me;
		} else {
			return $.grep(otherPlayers, function(player){ return player.username == username; })[0];
		}
	}

	function getMaxPlayers() {
		return maxPlayers;
	}

	function setMaxPlayers(n) {
		maxPlayers = n;
	}

	function getPlayersNeeded() {
		return maxPlayers - (otherPlayers.length + 1);
	}

	PlayersManager.prototype.addOtherPlayer = addOtherPlayer;
	PlayersManager.prototype.removePlayer = removePlayer;
	PlayersManager.prototype.setMe = setMe;
	PlayersManager.prototype.getMe = getMe;
	PlayersManager.prototype.getPlayerByUsername = getPlayerByUsername;
	PlayersManager.prototype.getMaxPlayers = getMaxPlayers;
	PlayersManager.prototype.setMaxPlayers = setMaxPlayers;
	PlayersManager.prototype.getPlayersNeeded = getPlayersNeeded;
}
