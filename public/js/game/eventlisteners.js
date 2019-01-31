function EventListeners() { }

EventListeners.addEventListeners = function(board, renderer, socketHandler, playersManager) {
	// board.drawBlock(1,1,false);
	renderer.getCanvas().addEventListener("mouseup", function(evt){
		// Get the position of the click
		var el = evt.target;
		var xPos = evt.clientX - el.offsetLeft;
		var yPos = evt.clientY - el.offsetTop;
		var x = Math.floor(xPos / renderer.blockSize - renderer.offsetX);
		var y = Math.floor(yPos / renderer.blockSize - renderer.offsetY);

		if (evt.which == 1) {
			// If the click is a left click
			console.log(x,y);
			var blocksToExpand = board.clickBlock(x, y);
			console.log("clicked on ", x, y);
			for (var i = 0; i < blocksToExpand.length; i++) {
				var block = blocksToExpand[i];
				socketHandler.expandBlock(block.x, block.y);
			}
			return;
		} else if (evt.which == 3) {
			// If the click is a right click
			if (board.flagBlock(x, y, playersManager.getMe().username)) {
				console.log(x, y);
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
			const key_up = 38;
			const key_down = 40;
			const key_left = 37;
			const key_right = 39;
			const key_esc = 27;

			var key = evt.keyCode ? evt.keyCode : evt.which;
			var offsetBy = 4;
			if (key == key_w || key == key_up) renderer.offsetY += offsetBy;
			if (key == key_s || key == key_down) renderer.offsetY -= offsetBy;
			if (key == key_a || key == key_left) renderer.offsetX += offsetBy;
			if (key == key_d || key == key_right) renderer.offsetX -= offsetBy;

			if (key == key_w || key == key_a || key == key_s || key == key_d || key == key_up || key == key_down || key == key_left || key == key_right) {
				renderer.drawBoard();
				renderer.getCanvas().dispatchEvent(new Event('mousemove'));
			}
		}
		window.addEventListener('keyup', function() {
			keydown = false;
		});
	});

	renderer.getCanvas().addEventListener("mousemove", function(evt) {
		if (board.selectedItem) {
			var el = evt.target;
			var xPos = evt.clientX - el.offsetLeft;
			var yPos = evt.clientY - el.offsetTop;
			var x = Math.floor(xPos / renderer.blockSize - renderer.offsetX);
			var y = Math.floor(yPos / renderer.blockSize - renderer.offsetY);

			if (!board.newHoveringBlock) {
				board.newHoveringBlock = {x: x, y: y};
			}

			if (board.newHoveringBlock.x !== x || board.newHoveringBlock.y !== y) {
				board.oldHoveringBlock = board.newHoveringBlock;
				board.newHoveringBlock = {x: x, y: y};
				board.hoveringBlockUpdated();
			}
		}
	});

	$("#item-radar").click(function() {
		board.selectItem(Items.RADAR);
	});

	$("#item-freeze").click(function() {
		board.selectItem(Items.FREEZE);
	});

	$("#item-weightless-shoes").click(function() {
		board.selectItem(Items.WEIGHTLESS_SHOES);
	});

	$("#item-blurred-vision").click(function() {
		board.selectItem(Items.BLURRED_VISION);
	});

	$("#item-lucky-moves").click(function() {
		board.selectItem(Items.LUCKY_MOVES);
	});


};
