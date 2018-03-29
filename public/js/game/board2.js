function Board(height, width, playersManager) {
	var self = this;
	var playerMe = playerMe;
	var ctx;
	var blocks = new Blocks();
	var socketHandler = undefined;
	this.oldHoveringBlock = undefined;
	this.newHoveringBlock = undefined;
	this.selectedItem = undefined;
	this.oldSelectedSize = 0;

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
		if (block.hovering && self.selectedItem) {
			ctx.fillStyle = self.selectedItem.fillColor;
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

	function clickBlock(x, y) {
		if (self.selectedItem !== undefined) {
			socketHandler.useItem(self.selectedItem.id, x, y);
			deselectItem();
			return [];
		} else {
			var block = blocks.getBlock(x, y);
			if (block.isUndefinedBlock) {
				block = new Block();
			}

			if (!block.expanded) {
				// Check that the block is not flagged
				if (block.flagColor === "") {
					block.expanded = true;
					blocks.setBlock(x, y, block);
					drawBlock(x, y);
					return [{x: x, y: y}];
				} else {
					return [];
				}
			} else {
				// If the block is already expanded
				var neighbors = blocks.getNeighbors(x, y);

				// Check if all mines around have been flagged
				var nFlagged = 0;
				for (var i = 0; i < neighbors.length; i++) {
					var neighbor = blocks.getBlock(neighbors[i].x, neighbors[i].y);
					if (!neighbor.isUndefinedBlock && neighbor.flagColor !== "")
						nFlagged++;
				}
				if (block.n !== nFlagged)
					return [];

				// All neighbors can be expanded, return neighbors to expand
				var toExpand = [];
				for (var i = 0; i < neighbors.length; i++) {
					var neighbor = blocks.getBlock(neighbors[i].x, neighbors[i].y);
					if (neighbor.isUndefinedBlock || (!neighbor.expanded && neighbor.flagColor === ""))
						toExpand.push({x: neighbors[i].x, y: neighbors[i].y});
				}
				return toExpand;
			}
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
			removeFlag(x, y, playersManager.getMe().username);
			return true;
		}
		return false;
	}

	function removeFlag(x, y, username) {
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
			update.block.isUndefinedBlock = false;
			blocks.setBlock(update.x, update.y, update.block);
			drawBlock(update.x, update.y);
		}
	}

	function giveRadarInfo(radarRange) {
		for (var i = 0; i < radarRange.length; i++) {
			var radarInfo = radarRange[i];
			var block = blocks.getBlock(radarInfo.x, radarInfo.y);
			if (block.isUndefinedBlock) {
				block = new Block();
			}
			block.radar = radarInfo.r;
			console.log(block.radar);
			drawBlock(radarInfo.x, radarInfo.y);
		}
	}

	function hoveringBlockUpdated() {
		var oBlock = self.oldHoveringBlock;
		var nBlock = self.newHoveringBlock;
		// const mid = 0;
		if (oBlock) {
			const oldMid = Math.floor((self.oldSelectedSize - 0.5) / 2);
			for (var i = 0; i < self.oldSelectedSize; i++) {
				for (var j = 0; j < self.oldSelectedSize; j++) {
					blocks.getBlock(oBlock.x + i - oldMid, oBlock.y + j - oldMid).hovering = undefined;
					drawBlock(oBlock.x + i - oldMid, oBlock.y + j - oldMid);
				}
			}
		}
		if (nBlock) {
			const size = self.selectedItem.range;
			const mid = Math.floor((size - 0.5) / 2);
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					blocks.getBlock(nBlock.x + i - mid, nBlock.y + j - mid).hovering = true;
					drawBlock(nBlock.x + i - mid, nBlock.y + j - mid);
				}
			}
			ctx.strokeRect((nBlock.x + self.offsetX - mid) * self.blockSize + 1, (nBlock.y + self.offsetY - mid) * self.blockSize + 1, self.blockSize * size - 2, self.blockSize * size - 2);
			self.oldSelectedSize = size;
		}
	}

	function selectItem(item) {
		if (self.selectedItem === item) {
			deselectItem();
		} else {
			self.selectedItem = item;
		}
	}

	function deselectItem() {
		self.selectedItem = undefined;
		self.oldHoveringBlock = self.newHoveringBlock;
		self.newHoveringBlock = undefined;
		self.hoveringBlockUpdated();
	}

	function useSocketHandler(newSocketHandler) {
		socketHandler = newSocketHandler;
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
	this.hoveringBlockUpdated = hoveringBlockUpdated;
	this.selectItem = selectItem;
	this.useSocketHandler = useSocketHandler;
	this.giveRadarInfo = giveRadarInfo;
}
