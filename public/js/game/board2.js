function Board(height, width, playersManager) {
	var self = this;
	var playerMe = playerMe;
	var ctx;
	var blocks = new Blocks();

	this.blockSize = 24;
	var height = height;
	var width = width;

	var canvas;

	this.offsetX = 0;
	this.offsetY = 0;
	// var img = new Image();
	// img.src = "/images/game/0.png";
	var images = new Images();

	createBoard();
	drawBoard();

	function drawBlock(x, y) {
		var block = blocks.getBlock(x, y); // Get the from indices

		var img;
		var newSrc = "";

		// if (block.expanded) {
		// 	if (block.isMine) {
		// 		img.src += "mine.png";
		// 	} else {
		// 		img.src += block.n + ".png";
		// 	}
		// } else {
		// 	if (block.flagged) {
		// 		img.src += "red_flag.png";
		// 	} else {
		// 		img.src += "unexpanded.png";
		// 	}
		if (block.isUndefinedBlock) {
			img = images.unexpanded;
		} else if (block.expanded) {
			img = images.n[block.n];
		} else if (!(block.flagColor === "")) {
			switch (block.flagColor) {
				case "red":
					img = images.flag_red
					break;
				case "green":
					img = images.flag_green
					break;
				case "purple":
					img = images.flag_purple
					break;
				case "yellow":
					img = images.flag_yellow
					break;
			}
		} else {
			img = images.unexpanded;
		}
		if (img) {
			ctx.drawImage(img, (x + self.offsetX) * self.blockSize, (y + self.offsetY) * self.blockSize);
		}
	}

	function drawBoard() {
		for (var i = 0; i < (Math.floor(width / self.blockSize) + 1); i++) {
			for (var j = 0; j < (Math.floor(height / self.blockSize) + 1); j++) {
				drawBlock(i - self.offsetX, j - self.offsetY);
			}
		}
		// var str1 = (0 - self.offsetX) + ", " + (0 - self.offsetY);
		// var str2 = (Math.floor(self.width / self.blockSize) - self.offsetX) + ", " + (Math.floor(self.height / self.blockSize) - self.offsetY);
		// console.log(str1 + " => " + str2);
	}

	function clickBlock(x, y) {
		var block = blocks.getBlock(x, y);
		if (block.isUndefinedBlock) {
			block = new Block();
		}

		// Check that the block is not flagged
		if (block.flagColor === "") {
			block.expanded = true;
			blocks.setBlock(x, y, block);
			drawBlock(x, y);
			console.log(block);
			return true;
		} else {
			return false;
		}
	}

	function flagBlock(x, y, username) {
		var player = playersManager.getPlayerByUsername(username);
		var block = blocks.getBlock(x, y);
		if (block.isUndefinedBlock) {
			block = new Block();
			blocks.setBlock(x, y, block);
		}
		if (block.flagColor === "") {
			// Add the block flag
			block.flagColor = player.color;
			block.flagOwner = username;
			drawBlock(x, y);
			playersManager.getTableHandler().incrementFlags(username);
			return true;
		} else if (block.flagOwner === playersManager.getMe().username) {
			// Remove the block flag
			removeFlag(x, y);
			return true;
		}
		return false;
	}

	function removeFlag(x, y) {
		playersManager.getTableHandler().decrementFlags(username);
		var block = blocks.getBlock(x, y);
		block.flagColor = "";
		drawBlock(x, y);
	}

	function createBoard() {
		canvas = document.createElement("canvas");
		canvas.height = height;
		canvas.width = width;
		ctx = canvas.getContext("2d");
		ctx = ctx;
		document.getElementById("game").appendChild(canvas);
		// drawBoard(false);
		// Disable context menu at right click
		canvas.oncontextmenu = function() {
			return false;
		}
		self.offsetX = Math.floor((width/self.blockSize)/2) - 20
		self.offsetY = Math.floor((height/self.blockSize)/2) - 12
	}

// 	drawBoard() {
// 	this.canvas = document.createElement("canvas");
// 	this.canvas.height = this.height * 24;
// 	this.canvas.width = this.width * 24;
// 	document.getElementById("head").style.width = this.canvas.width + "px"; // Set the width of the head
// 	this.ctx = this.canvas.getContext("2d");
// 	document.getElementById("game").appendChild(this.canvas);
// }

	function getCanvas() {
		return canvas;
	}

	function getBlocks() {
		return blocks;
	}

	function resizeBoard(newHeight, newWidth) {
		height = newHeight;
		width = newWidth;
		canvas.height = height;
		canvas.width = width;
		drawBoard();
	}

	function updateWorld(updates) {
		for (var i = 0; i < updates.length; i++) {
			var update = updates[i];
			console.log(update);
			blocks.setBlock(update.x, update.y, update.block);
			drawBlock(update.x, update.y);
		}
	}

	this.clickBlock = clickBlock;
	this.drawBoard = drawBoard;
	this.drawBlock = drawBlock;
	this.flagBlock = flagBlock;
	this.removeFlag = removeFlag;
	this.getCanvas = getCanvas;
	this.getBlocks = getBlocks;
	this.resizeBoard = resizeBoard;
	this.updateWorld = updateWorld;
}
