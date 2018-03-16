window.onload = function() {
	// board = new Board(30, 50, 150);
	// board = new Board(14*24, 22*24, 99);
	// board = new Board(20*24, 33*24, 99); //medium
	// board = new Board(27*24, 45*24, 99); //large
	var self = this;
	var cHeight = document.documentElement.clientHeight - 50;
	var cWidth = document.documentElement.clientWidth - 320;
	var playersManager = new PlayersManager();

	var board = new Board(cHeight, cWidth, playersManager, null);
	// board.drawBoard(true);
	var socket = io();
	var chatHandler = new ChatHandler();
	var socketHandler = new SocketHandler(chatHandler, socket, playersManager, board);

	EventListeners.addEventListeners(board, socketHandler);

	var resizeTimer;
	$(window).resize(function () {
		clearTimeout(resizeTimer);
	  resizeTimer = setTimeout(function() {
			var cHeight = document.documentElement.clientHeight - 50;
			var cWidth = document.documentElement.clientWidth - 320;
			board.resizeBoard(cHeight, cWidth);
			console.log("resized");
		}, 100);
	});

	inputMessage = function() {
		var message = $("#chat-message").val();
		chatHandler.inputMessage(message, socket);
		$("#chat-message").val("");
		return false;
	}
}

//
// window.onkeyup = function(e) {
//   var key = e.keyCode ? e.keyCode : e.which;
//
// 	switch(key) {
//     case key_w:
//         board.moveUp = false;
//         break;
//     case key_a:
//         board.moveLeft = false;
//         break;
// 		case key_s:
//         board.moveDown = false;
//         break;
// 		case key_d:
//         board.moveRight = false;
//         break;
// 	}
// }
//
