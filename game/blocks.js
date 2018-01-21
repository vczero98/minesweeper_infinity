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

	function resetBlocks() {
		blocks = [];
	}

	function getBlocksState() {
		return blocks;
	}

	function map(n) {
		if (n <= 0) {
			return n*-2;
		} else {
			return n*2-1;
		}
	}

	function revMap(n) {
		if (n % 2 == 0) {
			return n/-2;
		} else {
			return (n+1)/2;
		}
	}

	this.getBlock = getBlock;
	this.setBlock = setBlock;
	this.resetBlocks = resetBlocks;
	this.getBlocksState = getBlocksState;
	Blocks.prototype.revMap = revMap;
}

module.exports = Blocks;
