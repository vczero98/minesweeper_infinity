window.onload = function() {
	// board = new Board(30, 50, 150);
	// board = new Board(14*24, 22*24, 99);
	// board = new Board(20*24, 33*24, 99); //medium
	// board = new Board(27*24, 45*24, 99); //large
	var self = this;
	var cHeight = document.documentElement.clientHeight - 50;
	var cWidth = document.documentElement.clientWidth - 320;
	var playersManager = new PlayersManager();
	var board = new Board(cHeight, cWidth, playersManager);
	this.board = board;

	// board.drawBoard(true);
	var socket = io();
	var chatHandler = new ChatHandler();
	var socketHandler = new SocketHandler(chatHandler, socket, playersManager, board);



	// board.drawBlock(1,1,false);
	board.getCanvas().addEventListener("mouseup", function(evt){
		// Get the position of the click
		var el = evt.target;
		var xPos = evt.clientX - el.offsetLeft;
		var yPos = evt.clientY - el.offsetTop;
		var x = Math.floor(xPos / board.blockSize - board.offsetX);
		var y = Math.floor(yPos / board.blockSize - board.offsetY);

		if (evt.which == 1) {
			// // If the click is a left click
			board.clickBlock(x, y);
			return;
		} else if (evt.which == 3) {
			// If the click is a right click
			if (board.flagBlock(x, y, playersManager.getMe().username)) {
				socketHandler.flagBlock(x, y);
			}
			return;
		}
	});
	var keydown = false;
	window.addEventListener('keydown', function(evt) {
		// console.log(evt.target);
		if ($(evt.target).is('input')) { return true };
	  if (!keydown) {
	    keydown = true;
				const key_w = 87;
				const key_a = 65;
				const key_s = 83;
				const key_d = 68;

				var key = evt.keyCode ? evt.keyCode : evt.which;
				var offsetBy = 4;
				switch(key) {
			    case key_w:
			        board.offsetY += offsetBy;
			        break;
			    case key_s:
			        board.offsetY -= offsetBy;
			        break;
					case key_a:
			        board.offsetX += offsetBy;
			        break;
					case key_d:
			        board.offsetX -= offsetBy;
			        break;
					}

					if (key == key_w || key == key_a || key == key_s || key == key_d) {
						board.drawBoard();
					}
	  }
	  window.addEventListener('keyup', function() {
	    keydown = false;
	  });
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
