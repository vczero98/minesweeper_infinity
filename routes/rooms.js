var Room = require("../game/room");

var express = require("express");
// var router = express.Router();

var roomIdCounter = Math.floor(Math.random() * 100000);

module.exports = function(rooms) {
	var router = express.Router();

	router.get("/", function(req, res) {
		res.render("rooms", {selectedPage: "rooms", rooms: rooms});
	});

	router.post("/", function(req, res) {
		var id = (roomIdCounter++).toString(16);
		var name = req.body.name;
		var maxPlayers = parseInt(req.body.maxPlayers);
		var timer = parseInt(req.body.timer);

		if (name === "") {
			res.redirect("/rooms");
		} else if (isNaN(maxPlayers)) {
			res.redirect("/rooms");
		}	else if (isNaN(timer)) {
			res.redirect("/rooms");
		} else if (maxPlayers < 2 || maxPlayers > 4) {
			res.redirect("/rooms");
		} else {
			var newRoom = new Room(id, name, maxPlayers, timer);
			console.log("User created room " + newRoom.name);
			rooms.push(newRoom);
			res.redirect("/rooms");
		}
	});

	router.get("/:room_id", function(req, res) {
		var room = getRoomById(req.params.room_id);

		if (room == undefined) {
			res.redirect("/rooms")
		} else {
			res.render("gameroom", {inGameRoom: true, room: room});
		}

		// var room = getRoomById(req.params.room_id);
	  //
	  //
	  //
		// if (room == undefined) {
		// 	res.redirect("/rooms");
		// } else if (room.isFull()) {
		// 	remove(rooms, room);
		// 	res.redirect("/rooms");
		// } else {
		// 	room.players.push("player1");
		// 	res.redirect("/rooms");
		// }
	});

	function getRoomById(id) {
		for (var i = 0; i < rooms.length; i++) {
			if (rooms[i].id == id) {
				return rooms[i];
			}
		}

		return undefined;
	}

	function remove(array, element) {
	    const index = array.indexOf(element);
	    array.splice(index, 1);
	}

	return {router: router, rooms: rooms};
};
