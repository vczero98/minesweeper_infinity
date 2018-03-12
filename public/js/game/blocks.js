function Blocks() {
	var blocks = [];

	function getBlock(x, y) {
		var xIndex = map(x) + 1;
		var yIndex = map(y) + 1;

		if (blocks.length > xIndex) {
			var blockRow = blocks[xIndex];
			if (blockRow.length > yIndex) {
				return blockRow[yIndex];
			}
		}

		return {isUndefinedBlock: true};
	}

	function setBlock(x, y, block) {
		var xIndex = map(x) + 1;
		var yIndex = map(y) + 1;

		if (blocks.length - 1 < xIndex) {
			for (var i = blocks.length - 1; i < xIndex; i++) {
				blocks.push([]);
			}
		}

		var blockRow = blocks[xIndex];

		if (blockRow.length >= yIndex) {
			blockRow[yIndex] = block;
		} else {
			for (var i = blockRow.length; i < yIndex; i++) {
				blockRow.push({isUndefinedBlock: true});
			}
			blockRow.push(block);
		}

	}

	function setState(newBlocks) {
		blocks = newBlocks;
	}

	function getState() {
		return blocks;
	}

	function map(n) {
		if (n <= 0) {
			return n*-2;
		} else {
			return n*2-1;
		}
	}

	function getNeighbors(x, y) {
		var neighbors = [];
		// Expanding neighbors
		for (var i = x - 1; i <= x + 1; i++) {
			for (var j = y - 1; j <= y + 1; j++) {
				if (!(i == x && j == y)) {
					neighbors.push({x: i, y: j});
				}
			}
		}
		return neighbors;
	}

	this.getBlock = getBlock;
	this.setBlock = setBlock;
	this.getState = getState;
	this.setState = setState;
	this.getNeighbors = getNeighbors;
}
