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
		const spread = 3;
		for (var i = 1; i >= -1; i -= 2) {
			var x = 20;
			for (var j = 0; j <= 6; j++) {
				var y = 10 + (i * j) + (i === -1 ? -1 : 0);
				x += Math.floor(Math.random() * (spread * 2 - 1) - spread);
				var newBlock = new Block();
				newBlock.protect();
				for (var k = 0; k < 3; k++) {
					self.blocks.setBlock(x + k, y, newBlock);
				}
			}
		}
	}

	function startGame() {
		protectRange();
		// generateMines(0, 100, 0, 100);
		generateMines(-50, 50, -50, 50);
		// var block = new Block();
		// block.flagColor = "yellow";
		// self.blocks.setBlock(40,28,block);
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

	Room.prototype.startGame = startGame;
	Room.prototype.getNumPlayers = getNumPlayers;
	Room.prototype.isFull = isFull;
}

module.exports = Room;
