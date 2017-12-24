class Blocks {
	constructor() {
		this.blocks = [];
		this.undefinedBlock = new Block(true);
	}

	getBlock(x, y) {
		var xIndex = this.map(x) + 1;
		var yIndex = this.map(y) + 1;

		if (this.blocks.length > xIndex) {
			var blockRow = this.blocks[xIndex];
			if (blockRow.length > yIndex) {
				return blockRow[yIndex];
			}
		}

		return {isUndefinedBlock: true};
	}

	setBlock(x, y, block) {
		var xIndex = this.map(x) + 1;
		var yIndex = this.map(y) + 1;

		if (this.blocks.length - 1 < xIndex) {
			for (var i = this.blocks.length - 1; i < xIndex; i++) {
				this.blocks.push([]);
			}
		}

		var blockRow = this.blocks[xIndex];

		if (blockRow.length >= yIndex) {
			blockRow[yIndex] = block;
		} else {
			for (var i = blockRow.length; i < yIndex; i++) {
				blockRow.push({isUndefinedBlock: true});
			}
			blockRow.push(block);
		}

	}

	map(n) {
		if (n <= 0) {
			return n*-2;
		} else {
			return n*2-1;
		}
	}
}
