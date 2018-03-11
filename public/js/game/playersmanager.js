function PlayersManager() {
	var otherPlayers = [];
	var me;
	var maxPlayers;
	var playerTableHandler;

	function addOtherPlayer(player) {
		otherPlayers.push(player);
		playerTableHandler.addPlayer(player);
	}

	function removePlayer(username) {
		otherPlayers.splice(otherPlayers.indexOf(getPlayerByUsername(username)), 1);
		playerTableHandler.removePlayer(username);
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

	function addPlayerToTable(player) {
		playerTableHandler.addPlayer(player);
	}

	function createTable() {
		 playerTableHandler = new PlayerTableHandler(maxPlayers);
	}

	function getTableHandler() {
		return playerTableHandler;
	}

	this.addOtherPlayer = addOtherPlayer;
	this.removePlayer = removePlayer;
	this.setMe = setMe;
	this.getMe = getMe;
	this.getPlayerByUsername = getPlayerByUsername;
	this.getMaxPlayers = getMaxPlayers;
	this.setMaxPlayers = setMaxPlayers;
	this.getPlayersNeeded = getPlayersNeeded;
	this.addPlayerToTable = addPlayerToTable;
	this.createTable = createTable;
	this.getTableHandler = getTableHandler;
}
