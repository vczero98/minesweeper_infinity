function Board(height, width, playersManager) {
	var self = this;
	var playerMe = playerMe;
	self.blocks = new Blocks();

	self.blockSize = 24;
	self.height = height;
	self.width = width;

	self.offsetX = 0;
	self.offsetY = 0;

	createBoard();

	function drawBlock(x, y, one) {
		var block = self.blocks.getBlock(x, y); // Get the from indices
		// Create canvas and ctx
		var blockCanvas = document.createElement("canvas");
		var blockCtx = blockCanvas.getContext("2d");

		var img = new Image();
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
		if (one) {
			newSrc += "1.png";
		} else {
			if (block.isUndefinedBlock) {
				newSrc += "unexpanded.png";
			} else if (block.expanded) {
				newSrc += "0.png";
			} else if (block.isFlagged()) {
				console.log(block.flagColor);
				newSrc += "flag_" + block.flagColor + ".png";
			} else {
				newSrc += "unexpanded.png";
			}
		}

		if (!(newSrc === "")) {
			img.src = "/images/game/" + newSrc;
			// console.log("flagging block " + x + ", " + y + " with color " + block.flagColor);
			// console.log(img.src);
			// debugger;
			// console.log(x, y);
			self.ctx.drawImage(img, (x + self.offsetX) * self.blockSize, (y + self.offsetY) * self.blockSize);
			// console.log(img, (x + self.offsetX) * self.blockSize, (y + self.offsetY) * self.blockSize);
		}
		// self.ctx.drawImage(self.img, 0, 0);
	}

	function drawBoard() {
		for (var i = 0; i < (Math.floor(self.width / self.blockSize) + 1); i++) {
			for (var j = 0; j < (Math.floor(self.height / self.blockSize) + 1); j++) {
				drawBlock(i - self.offsetX, j - self.offsetY, false);
			}
		}
		// var str1 = (0 - self.offsetX) + ", " + (0 - self.offsetY);
		// var str2 = (Math.floor(self.width / self.blockSize) - self.offsetX) + ", " + (Math.floor(self.height / self.blockSize) - self.offsetY);
		// console.log(str1 + " => " + str2);
	}

	function clickBlock(x, y) {
		var block = self.blocks.getBlock(x, y);
		if (block.isUndefinedBlock) {
			block = new Block();
			self.blocks.setBlock(x, y, block);
			block.expanded = true;
			drawBlock(x, y, false);
		} else {
			console.log("found old block");
		}
	}

	function flagBlock(x, y, color) {
		var block = self.blocks.getBlock(x, y);
		if (block.isUndefinedBlock) {
			block = new Block();
			self.blocks.setBlock(x, y, block);
		}
		if (!block.isFlagged()) {
			console.log("found old block");
			block.flagColor = color;
			drawBlock(x, y, false);
			return true;
		}
		return false;
	}

	function createBoard() {
		self.canvas = document.createElement("canvas");
		self.canvas.height = self.height;
		self.canvas.width = self.width;
		// document.getElementById("head").style.width = self.canvas.width + "px"; // Set the width of the head
		self.ctx = self.canvas.getContext("2d");
		document.getElementById("game").appendChild(self.canvas);
		drawBoard();
		// Disable context menu at right click
		self.canvas.oncontextmenu = function() {
			return false;
		}
	}

// 	drawBoard() {
// 	this.canvas = document.createElement("canvas");
// 	this.canvas.height = this.height * 24;
// 	this.canvas.width = this.width * 24;
// 	document.getElementById("head").style.width = this.canvas.width + "px"; // Set the width of the head
// 	this.ctx = this.canvas.getContext("2d");
// 	document.getElementById("game").appendChild(this.canvas);
// }

	Board.prototype.clickBlock = clickBlock;
	Board.prototype.drawBoard = drawBoard;
	Board.prototype.flagBlock = flagBlock;
}
