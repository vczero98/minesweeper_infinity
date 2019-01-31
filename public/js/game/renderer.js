function Renderer(height, width, board) {
	var self = this;
	var board;
	var blocks = board.getBlocks();

	var ctx;
	var canvas;

	var images = new Images();

	this.images = images;
	this.blockSize = 24;
	this.offsetX = 0;
	this.offsetY = 0;

	var rectangles = [];
	var rectangleIdCounter = 0;

	var height = height;
	var width = width;

	function drawBlock(x, y) {
		var block = blocks.getBlock(x, y); // Get the from indices

		var img;
		var newSrc = "";

		const xPixelPos = (x + self.offsetX) * self.blockSize;
		const yPixelPos = (y + self.offsetY) * self.blockSize;

		if (block.isUndefinedBlock) {
			img = images.unexpanded;
		} else if (block.exploadedMine !== "") {
			switch (block.exploadedMine) {
				case "red":
					img = images.mine_red;
					break;
				case "green":
					img = images.mine_green;
					break;
				case "purple":
					img = images.mine_purple;
					break;
				case "yellow":
					img = images.mine_yellow;
					break;
			}
		}	else if (block.expanded) {
			img = images.n[block.n];
		} else if (!(block.flagColor === "")) {
			switch (block.flagColor) {
				case "red":
					img = images.flag_red;
					break;
				case "green":
					img = images.flag_green;
					break;
				case "purple":
					img = images.flag_purple;
					break;
				case "yellow":
					img = images.flag_yellow;
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
			if (block.frozen) {
				console.log("frozen block");
				ctx.drawImage(images.frozen, (x + self.offsetX) * self.blockSize, (y + self.offsetY) * self.blockSize);
			}
		}
		if (block.hovering && board.selectedItem) {
			ctx.fillStyle = board.selectedItem.fillColor;
			ctx.fillRect((x + self.offsetX) * self.blockSize, (y + self.offsetY) * self.blockSize, self.blockSize, self.blockSize);
		}

		// TODO: Block redrawn when expanded block is flagged
		// Check if there is a rectangle on the block
		for (var i = 0; i < rectangles.length; i++) {
			var position = positionOnRect(x, y, rectangles[i]);
			if (position !== "") {
				ctx.strokeStyle = rectangles[i].getColor();
				// ctx.translate(0.5, 0.5);
				ctx.lineWidth = 3;
				const t = 2 // Translate lines by
				ctx.beginPath();

				if (rectangles[i].getHeight() === 1 && rectangles[i].getWidth() === 1) {
					ctx.moveTo(xPixelPos + t, yPixelPos + t);
					ctx.lineTo(xPixelPos + self.blockSize - t, yPixelPos + t);
					ctx.lineTo(xPixelPos + self.blockSize - t, yPixelPos + self.blockSize - t);
					ctx.lineTo(xPixelPos + t, yPixelPos + self.blockSize - t);
					ctx.lineTo(xPixelPos + t, yPixelPos + t);
				} else if (position === "TL") {
					ctx.moveTo(xPixelPos + self.blockSize, yPixelPos + t);
					ctx.lineTo(xPixelPos + t, yPixelPos + t);
					ctx.lineTo(xPixelPos + t, yPixelPos + self.blockSize);
				} else if (position === "TR") {
					ctx.moveTo(xPixelPos, yPixelPos + t);
					ctx.lineTo(xPixelPos + self.blockSize - t, yPixelPos + t);
					ctx.lineTo(xPixelPos + self.blockSize - t, yPixelPos + self.blockSize);
				} else if (position === "BL") {
					ctx.moveTo(xPixelPos + t, yPixelPos);
					ctx.lineTo(xPixelPos + t, yPixelPos + self.blockSize - t);
					ctx.lineTo(xPixelPos + self.blockSize, yPixelPos + self.blockSize - t);
				} else if (position === "BR") {
					ctx.moveTo(xPixelPos + self.blockSize - t, yPixelPos);
					ctx.lineTo(xPixelPos + self.blockSize - t, yPixelPos + self.blockSize - t);
					ctx.lineTo(xPixelPos, yPixelPos + self.blockSize - t);

					// Draw icon
					if (rectangles[i].getIcon() !== undefined) {
						const iconX = (x + self.offsetX) * self.blockSize + (self.blockSize - 15) - 3;
						const iconY = (y + self.offsetY) * self.blockSize + (self.blockSize - 15) - 3;
						ctx.stroke();
						ctx.beginPath();
						ctx.drawImage(rectangles[i].getIcon(), iconX, iconY);
					}
				} else if (position === "T") {
					ctx.moveTo(xPixelPos, yPixelPos + t);
					ctx.lineTo(xPixelPos + self.blockSize, yPixelPos + t);
				} else if (position === "R") {
					ctx.moveTo(xPixelPos + self.blockSize - t, yPixelPos);
					ctx.lineTo(xPixelPos + self.blockSize - t, yPixelPos + self.blockSize);
				} else if (position === "B") {
					ctx.moveTo(xPixelPos, yPixelPos + self.blockSize - t);
					ctx.lineTo(xPixelPos + self.blockSize, yPixelPos + self.blockSize - t);
				} else if (position === "L") {
					ctx.moveTo(xPixelPos + t, yPixelPos + self.blockSize);
					ctx.lineTo(xPixelPos + t, yPixelPos);
				}
				ctx.stroke();
				// ctx.translate(-0.5, -0.5);
			}
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
		// ctx.translate(0.5, 0.5);
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
		drawBoard();
	}

	function addRectangle(x, y, height, width, color) {
		rectangles.push(new Rectangle(x, y, height, width, color, rectangleIdCounter++));
		return rectangleIdCounter - 1;
	}

	function removeRectangle(id) {
		for (var i = 0; i < rectangles.length; i++) {
			if (rectangles[i].getId() == id) {
				var rectangle = rectangles[i];
				// var x1 = rectangle.getX();
				// var y1 = rectangle.getY();
				// var x2 = x1 + rectangle.getWidth() - 1;
				// var y2 = y1 + rectangle.getHeight() - 1;
				// var border = getBorderOfRange(x1, y1, x2, y2);
				rectangles.splice(i, 1);
				// for (var b = 0; b < border.length; b++) {
				// 	drawBlock(border[b].x, border[b].y);
				// }
				return;
			}
		}
	}

	function getRectangle(id) {
		for (var i = 0; i < rectangles.length; i++) {
			if (rectangles[i].getId() == id) {
				return rectangles[i];
			}
		}
	}

	function getBorderOfRange(x1, y1, x2, y2) {
		var border = [];
		for (var i = x1; i <= x2; i++) {
			for (var j = y1; j <= y2; j++) {
				var t = "";
				if (i === x1 && j === y1) t = "TL";
				else if (i === x2 && j === y1) t = "TR";
				else if (i === x1 && j === y2) t = "BL";
				else if (i === x2 && j === y2) t = "BR";
				else if (i === x1) t = "L";
				else if (i === x2) t = "R";
				else if (j === y1) t = "T";
				else if (j === y2) t = "B";

				if (t != "") border.push({x: i, y: j, t: t});
			}
		}
		return border;
	}

	function positionOnRect(x, y, rectangle) {
		var x1 = rectangle.getX();
		var y1 = rectangle.getY();
		var x2 = x1 + rectangle.getWidth() - 1;
		var y2 = y1 + rectangle.getHeight() - 1;

		var p = "";

		if (x < x1 || x > x2 || y < y1 || y > y2) p = ""; // Out of range
		else if (x === x1 && y === y1) p = "TL";
		else if (x === x2 && y === y1) p = "TR";
		else if (x === x1 && y === y2) p = "BL";
		else if (x === x2 && y === y2) p = "BR";
		else if (x === x1) p = "L";
		else if (x === x2) p = "R";
		else if (y === y1) p = "T";
		else if (y === y2) p = "B";

		return p;
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

	this.addRectangle = addRectangle;
	this.removeRectangle = removeRectangle;
	this.getRectangle = getRectangle;
	this.resizeBoard = resizeBoard;
	this.drawBlock = drawBlock;
	this.drawBoard = drawBoard;
	this.createBoard = createBoard;
}
