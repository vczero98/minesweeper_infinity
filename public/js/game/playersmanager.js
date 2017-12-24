function PlayersManager() {
	var otherPlayers = [];
	var me;

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
		if (me.username = username) {
			return me;
		} else {
			var result = $.grep(otherPlayers, function(player){ return player.username == username; });
		}
	}

	PlayersManager.prototype.addOtherPlayer = addOtherPlayer;
	PlayersManager.prototype.removePlayer = removePlayer;
	PlayersManager.prototype.setMe = setMe;
	PlayersManager.prototype.getMe = getMe;
	PlayersManager.prototype.getPlayerByUsername = getPlayerByUsername;
}
