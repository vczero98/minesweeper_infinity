function Room(id, name, maxPlayers, time) {
	this.id = id;
	this.name = name;
	this.maxPlayers = maxPlayers;
	this.players = [];
	this.time = time;
}

Room.prototype.getNumPlayers = function() {
	return this.players.length;
}

Room.prototype.isFull = function() {
	return this.getNumPlayers() >= this.maxPlayers;
}

module.exports = Room;
