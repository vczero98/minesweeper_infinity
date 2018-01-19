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

	Blocks.prototype.getBlock = getBlock;
	Blocks.prototype.setBlock = setBlock;
	Blocks.prototype.getState = getState;
	Blocks.prototype.setState = setState;
}
