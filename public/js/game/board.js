class Board {
	constructor(height, width, numMines) {
		this.height = height;
		this.width = width;
		this.blockSize = 24;
		this.numMines = Math.min(numMines, (height * width - 1));
		this.numMinesLeft = this.numMines;
		this.blocks = new Blocks();
		this.drawBoard();
		this.updateMineDisplay();
		this.gameStarted = false;
		this.gameOver = false;
		this.elapsedTime = 0;
		this.timer;
		this.offsetX = 0;
		this.offsetY = 0;
		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;

		for (var x = -100; x <= 100; x++) {
			for (var y = -100; y <= 100; y++) {
				var b = new Block();
				this.blocks.setBlock(x, y, b);
			}
		}

		// Disable context menu at right click
		this.canvas.oncontextmenu = function() {
			return false;
		}
	}

	drawBoard() {
		this.canvas = document.createElement("canvas");
		this.canvas.height = this.height;
		this.canvas.width = this.width;
		// document.getElementById("head").style.width = this.canvas.width + "px"; // Set the width of the head
		this.ctx = this.canvas.getContext("2d");
		document.getElementById("game").appendChild(this.canvas);
	}

	drawBlock(x, y) {
		var block = this.blocks.getBlock(x, y); // Get the from indices
		// Create canvas and ctx
		var blockCanvas = document.createElement("canvas");
		var blockCtx = blockCanvas.getContext("2d");

		var img = new Image();
		img.src = "/images/game/";
		console.log(blockCanvas.toDataURL());

		if (block.expanded) {
			if (block.isMine) {
				img.src += "mine.png";
			} else {
				img.src += block.n + ".png";
			}
		} else {
			if (block.flagged) {
				img.src += "red_flag.png";
			} else {
				img.src += "unexpanded.png";
			}
		}

		//img.src = blockCanvas.toDataURL();
		blockCtx.drawImage(img, x * this.blockSize - this.offsetX, y * this.blockSize - this.offsetY);
	}

	redrawBoard() {
		var firstBlockX = Math.floor(this.offsetX / this.blockSize);
		var firstBlockY = Math.floor(this.offsetY / this.blockSize);

		var lastBlockX = firstBlockX + Math.floor(this.width / this.blockSize);
		var lastBlockY = firstBlockY + Math.floor(this.height / this.blockSize);

		for (var i = firstBlockX; i <= lastBlockX; i++) {
			for (var j = firstBlockY; j <= lastBlockY; j++) {
				this.drawBlock(i, j);
			}
		}
	}

	expandBlock(x, y) {
		// Returns true if the block can be expanded
		var block = this.blocks.getBlock(x, y);
		if (block.expanded || block.flagged) {
			return false;
		}
		block.expanded = true;
		this.drawBlock(x, y);
		if (block.n == 0 && !block.isMine) {
			var neighbours = this.getNeighboursOfBlock(x, y);
			for (var i = 0; i < neighbours.length; i++) {
				this.expandBlock(neighbours[i][0], neighbours[i][1]);
			}
		}
		return true;
	}

	flagBlock(x, y) {
		var block = this.blocks.getBlock(x, y);
		if (block.expanded) {
			return;
		}
		if (block.flagged) {
			this.numMinesLeft++;
		} else {
			this.numMinesLeft--;
		}
		block.flagged = !block.flagged;
		this.drawBlock(x, y);
		this.updateMineDisplay();
	}

	generateMines() {
		var minesLeft = this.numMines;
		while (minesLeft != 0) {
			var xPos = Math.trunc(Math.random() * Math.floor(this.width/this.blockSize)); // Generate a number from 0 to the upper bound (exclusive)
			var yPos = Math.trunc(Math.random() * Math.floor(this.height/this.blockSize));
			var block = this.blocks.getBlock(xPos, yPos);
			// Check if the block is not a mine already or not protected
			if (!block.isMine && !block.protected) {
				// Set the block to be a mine
				block.isMine = true;
				this.drawBlock(xPos, yPos);
				// Increase the number of the neighbours of the mine
				var neighbours = this.getNeighboursOfBlock(xPos, yPos);
				for (var i = 0; i < neighbours.length; i++) {
					this.blocks.getBlock(neighbours[i][0],neighbours[i][1]).incrementN();
				}
				minesLeft--;
			}
		}
	}

	clickBlock(x, y) {
		// Returns false if the game is over, true otherwise
		if (this.gameOver) {
			return true;
		}
		if (this.expandBlock(x, y)) {
			if (this.blocks.getBlock(x,y).isMine) {
				this.blocks.getBlock(x,y).losingBlock = true;
				this.endGame();
				return false;
			}
		}
		return true;
	}

	startGame() {
		this.gameStarted = true;
		// document.getElementById("displayTime").innerText = 0;
		this.timer = setInterval(this.updateTimeDisplay, 1000);
	}

	endGame() {
		this.gameOver = true;
		clearInterval(this.timer);
		for (var i = 0; i < Math.floor(this.width/this.blockSize); i++) {
			for (var j = 0; j < Math.floor(this.height/this.blockSize); j++) {
				var block = this.blocks.getBlock(i, j);
				if (block.isMine) {
					block.expanded = true;
					this.drawBlock(i, j);
				} else if (!block.isMine && block.flagged) {
					this.drawBlock(i, j);
				}
			}
		}
	}

	getNeighboursOfBlock(x, y) {
		var neighbours = [];
		for (var i = (x - 1); i <= (x + 1); i++) {
			for (var j = (y - 1); j <= (y + 1); j++) {
				if (!(i == x && j == y) && !this.isOutOfRange(i, j)) {
					neighbours.push([i, j]);
				}
			}
		}
		return neighbours;
	}

	isOutOfRange(x, y) {
		// return ((Math.min(x, y) < 0) || (x > (this.width - 1)) || (y > (this.height - 1)));
		return false;
	}

	updateMineDisplay() {
		// document.getElementById("displayMinesLeft").innerText = Math.max(this.numMinesLeft, 0);
	}

	updateTimeDisplay() {
		// board.elapsedTime++;
		// document.getElementById("displayTime").innerText = board.elapsedTime;
	}
}
