var Room = require("../game/room");

var express = require("express");
// var router = express.Router();

var roomIdCounter = Math.floor(Math.random() * 100000);

module.exports = function(roomsHandler) {
	var router = express.Router();

	router.get("/", function(req, res) {
		res.render("rooms", {selectedPage: "rooms", roomsHandler: roomsHandler});
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
			roomsHandler.rooms.push(newRoom);
			res.redirect("/rooms");
		}
	});

	router.get("/:room_id", function(req, res) {
		var room = roomsHandler.getRoomById(req.params.room_id);

		if (room == undefined) {
			res.redirect("/rooms")
		} else {
			req.session.roomid = req.params.room_id; // Store the room id in the cookie, will be used by the socket
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

	function remove(array, element) {
	    const index = array.indexOf(element);
	    array.splice(index, 1);
	}

	return {router: router, roomsHandler: roomsHandler};
};
