window.onload = function() {
	var self = this;
	var cHeight = document.documentElement.clientHeight - 50;
	var cWidth = document.documentElement.clientWidth - 320;
	var playersManager = new PlayersManager();

	var board = new Board(playersManager);
	var renderer = new Renderer(cHeight, cWidth, board);
	board.setRenderer(renderer);
	// board.drawBoard(true);
	var socket = io();
	var chatHandler = new ChatHandler();
	var socketHandler = new SocketHandler(chatHandler, socket, playersManager, board, renderer);

	renderer.init();

	EventListeners.addEventListeners(board, renderer, socketHandler, playersManager);

	var resizeTimer;
	$(window).resize(function () {
		clearTimeout(resizeTimer);
	  resizeTimer = setTimeout(function() {
			var cHeight = document.documentElement.clientHeight - 50;
			var cWidth = document.documentElement.clientWidth - 320;
			renderer.resizeBoard(cHeight, cWidth);
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
