var Blocks = require("./blocks");
var Block = require("./block");

function Room(id, name, maxPlayers, time, isPrivate) {
	var self = this;
	this.id = id;
	this.name = name;
	this.maxPlayers = maxPlayers;
	this.players = [];
	this.time = time;
	this.availableColors = ["yellow", "purple", "green", "red"];
	this.blocks = new Blocks();
	this.isPrivate = isPrivate;
	const mineRate = 99/480; // How many blocks are mines
	startGame();

	function protectRange() {
		// Protecting around (20,10)
		for (var x = 19; x <= 21; x++) {
			for (var y = 9; y <= 11; y++) {
				var newBlock = new Block();
				newBlock.protect();
				self.blocks.setBlock(x, y, newBlock);
			}
		}

		// Generating the rest of the pattern
		const spread = 2;
		for (var i = 1; i >= -1; i -= 2) {
			var y = 10;
			for (var j = 0; j <= 15; j++) {
				var x = 20 + (i * j) + (i === -1 ? -1 : 0);
				for (var k = 0; k < 9; k++) {
					var newBlock = new Block();
					newBlock.protect();
					self.blocks.setBlock(x, y + k, newBlock);
				}
				if (x % 3 == 0) {
					y += Math.floor(Math.random() * (spread * 2) - spread);
				}
			}
		}

		// // Generating the rest of the pattern
		// const spread = 2;
		// for (var i = 1; i >= -1; i -= 2) {
		// 	var x = 20;
		// 	for (var j = 0; j <= 12; j++) {
		// 		var y = 10 + (i * j) + (i === -1 ? -1 : 0);
		// 		for (var k = 0; k < 7; k++) {
		// 			var newBlock = new Block();
		// 			newBlock.protect();
		// 			self.blocks.setBlock(x + k, y, newBlock);
		// 		}
		// 		if (y % 3 == 0) {
		// 			x += Math.floor(Math.random() * (spread * 2 - 1) - spread);
		// 		}
		// 	}
		// }
	}

	function startGame() {
		protectRange();
		// generateMines(0, 100, 0, 100);
		generateMines(-50, 50, -50, 50);
		// var block = new Block();
		// block.flagColor = "yellow";
		// self.blocks.setBlock(40,28,block);
		expandBlock(20,10);
	}

	function getNumPlayers() {
		return this.players.length;
	}

	function isFull() {
		return this.getNumPlayers() >= this.maxPlayers;
	}

	function generateMines(xMin, xMax, yMin, yMax) {
		// for (var x = xMin; x <= xMax; x++) {
		// 	for (var y = yMin; y <= yMax; y++) {
		// 		self.blocks.setBlock(x, y, new Block());
		// 	}
		// }
		var minesLeft = Math.floor(((xMax - xMin) * (yMax - yMin)) * mineRate); // Area * how common mines are
		while (minesLeft > 0) {
			var x = Math.floor(Math.random() * (xMax - xMin) + 1 + xMin);
			var y = Math.floor(Math.random() * (yMax - yMin) + 1 + yMin);
			var block = self.blocks.getBlock(x, y);

			if (block.isUndefinedBlock) {
				block = new Block();
			}

			if (!block.isMine() && !block.isProtected()) {
				block.setMine();
				minesLeft -= 1;
				self.blocks.setBlock(x, y, block);

				// Incrementing numbers on neighbors
				// console.log("block", x, y);
				for (var i = x - 1; i <= x + 1; i++) {
					for (var j = y - 1; j <= y + 1; j++) {
						if (!(i == x && j == y)) {
							var neighborBlock = self.blocks.getBlock(i, j);
							if (neighborBlock.isUndefinedBlock) {
								neighborBlock = new Block();
							}
							neighborBlock.n += 1;
							self.blocks.setBlock(i, j, neighborBlock);
							// console.log("neighbour", i, j, neighborBlock.n);
						}
					}
				}
			}
		}
		var m_count = 0;
		var state = self.blocks.getBlocksState();
		for (var i = 0; i < state.length; i++) {
			var row = state[i];
			for (var j = 0; j < row.length; j++) {
				if (!row[j].isUndefinedBlock && row[j].isMine()) {
					m_count++;
				}
			}
		}
	}

	function expandBlock(x, y) {
		var updates = [];
		var block = self.blocks.getBlock(x, y);
		if (block.isUndefinedBlock) {
			block = new Block();
		}
		if (block.expanded) {
			return [];
		}
		if (block.isMine()) {
			block.exploadedMine = true;
			return [{x: x, y: y, block: block}];
		}
		block.expanded = true;
		self.blocks.setBlock(x,y,block);
		if (block.n == 0) {
			// Expanding neighbors
			for (var i = x - 1; i <= x + 1; i++) {
				for (var j = y - 1; j <= y + 1; j++) {
					if (!(i == x && j == y)) {
						updates = updates.concat(expandBlock(i, j));
					}
				}
			}
		}
		updates.push({x: x, y: y, block: block});
		return updates;
	}

	this.startGame = startGame;
	this.getNumPlayers = getNumPlayers;
	this.isFull = isFull;
}

module.exports = Room;
