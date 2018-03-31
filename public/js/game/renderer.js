function Renderer(height, width, board) {
	var self = this;
	var board;
	var blocks = board.getBlocks();

	var ctx;
	var canvas;

	var images = new Images();

	this.blockSize = 24;
	this.offsetX = 0;
	this.offsetY = 0;

	var rectangles = [];
	var rectangleId = 0;

	var height = height;
	var width = width;

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
		} else if (block.exploadedMine !== "") {
			switch (block.exploadedMine) {
				case "red":
					img = images.mine_red
					break;
				case "green":
					img = images.mine_green
					break;
				case "purple":
					img = images.mine_purple
					break;
				case "yellow":
					img = images.mine_yellow
					break;
			}
		}	else if (block.expanded) {
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
		} else if (block.radar !== undefined) {
			if (block.radar) {
				img = images.radar1;
			} else {
				img = images.radar0;
			}
		} else {
			img = images.unexpanded;
		}

		if (img) {
			ctx.drawImage(img, (x + self.offsetX) * self.blockSize, (y + self.offsetY) * self.blockSize);
		}
		if (block.hovering && board.selectedItem) {
			ctx.fillStyle = board.selectedItem.fillColor;
			ctx.fillRect((x + self.offsetX) * self.blockSize, (y + self.offsetY) * self.blockSize, self.blockSize, self.blockSize);
			// ctx.strokeRect((x + self.offsetX) * self.blockSize + 1, (y + self.offsetY) * self.blockSize + 1, self.blockSize - 2, self.blockSize - 2);
		}
	}

	function drawBoard() {
		for (var i = 0; i < (Math.floor(width / self.blockSize) + 1); i++) {
			for (var j = 0; j < (Math.floor(height / self.blockSize) + 1); j++) {
				drawBlock(i - self.offsetX, j - self.offsetY);
			}
		}
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

	function resizeBoard(newHeight, newWidth) {
		height = newHeight;
		width = newWidth;
		canvas.height = height;
		canvas.width = width;
		renderer.drawBoard();
	}

	this.getCanvas = function() {
		return canvas;
	}

	this.init = function() {
		self.createBoard();
		self.drawBoard();
	}

	// TODO: Remove after rectangles
	this.getCtx = function() {
		return ctx;
	}

	this.resizeBoard = resizeBoard;
	this.drawBlock = drawBlock;
	this.drawBoard = drawBoard;
	this.createBoard = createBoard;
}
