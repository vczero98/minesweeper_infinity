function EventListeners() { }

EventListeners.addEventListeners = function(board, socketHandler) {
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
			const key_esc = 27;

			var key = evt.keyCode ? evt.keyCode : evt.which;
			console.log(key);
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
				case key_esc:
					// Cancel the selected item
					selectItem(board.selectedItem);
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

	board.getCanvas().addEventListener("mousemove", function(evt) {
		if (board.selectedItem) {
			var el = evt.target;
			var xPos = evt.clientX - el.offsetLeft;
			var yPos = evt.clientY - el.offsetTop;
			var x = Math.floor(xPos / board.blockSize - board.offsetX);
			var y = Math.floor(yPos / board.blockSize - board.offsetY);

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
		selectItem(Items.RADAR);
	});

	$("#item-freeze").click(function() {
		selectItem(Items.FREEZE);
	});

	$("#item-weightless-shoes").click(function() {
		selectItem(Items.WEIGHTLESS_SHOES);
	});

	$("#item-blurred-vision").click(function() {
		selectItem(Items.BLURRED_VISION);
	});

	$("#item-lucky-moves").click(function() {
		selectItem(Items.LUCKY_MOVES);
	});

	function selectItem(item) {
		if (board.selectedItem === item) {
			board.selectedItem = undefined;
			board.oldHoveringBlock = board.newHoveringBlock;
			board.newHoveringBlock = undefined;
			board.hoveringBlockUpdated();
		} else {
			board.selectedItem = item;
		}
	}
};
