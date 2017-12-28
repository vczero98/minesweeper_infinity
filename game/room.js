var Blocks = require("./blocks");

function Room(id, name, maxPlayers, time, isPrivate) {
	this.id = id;
	this.name = name;
	this.maxPlayers = maxPlayers;
	this.players = [];
	this.time = time;
	this.availableColors = ["yellow", "purple", "green", "red"];
	this.blocks = new Blocks();
	this.isPrivate = isPrivate;
}

Room.prototype.getNumPlayers = function() {
	return this.players.length;
}

Room.prototype.isFull = function() {
	return this.getNumPlayers() >= this.maxPlayers;
}

module.exports = Room;
