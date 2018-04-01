function Board(playersManager) {
	var self = this;
	var playerMe = playerMe;
	var renderer;

	var blocks = new Blocks();
	var socketHandler = undefined;
	var renderer = renderer;
	this.oldHoveringBlock = undefined;
	this.newHoveringBlock = undefined;
	var hoveringRect = undefined;
	this.selectedItem = undefined;
	this.oldSelectedSize = 0;

	function clickBlock(x, y) {
		if (self.selectedItem !== undefined) {
			socketHandler.useItem(self.selectedItem.id, x, y);
			itemActivated();
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
					renderer.drawBlock(x, y);
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
		console.log("undefined block: " + block.isUndefinedBlock);
		if (block.isUndefinedBlock) {
			block = new Block();
			blocks.setBlock(x, y, block);
		}
		if (block.flagColor === "") {
			// Add the block flag
			block.flagColor = player.color;
			block.flagOwner = username;
			blocks.setBlock(x, y, block);
			console.log(block);
			renderer.drawBlock(x, y);
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
		renderer.drawBlock(x, y);
	}

	function getBlocks() {
		return blocks;
	}

	function updateWorld(updates) {
		for (var i = 0; i < updates.length; i++) {
			var update = updates[i];
			update.block.isUndefinedBlock = false;
			blocks.setBlock(update.x, update.y, update.block);
			renderer.drawBlock(update.x, update.y);
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
			renderer.drawBlock(radarInfo.x, radarInfo.y);
		}
	}

	function hoveringBlockUpdated() {
		var oBlock = self.oldHoveringBlock;
		var nBlock = self.newHoveringBlock;
		// const mid = 0;
		if (oBlock) {
			const oldMid = Math.floor((self.oldSelectedSize - 0.5) / 2);
			if (hoveringRect !== undefined)
				renderer.removeRectangle(hoveringRect);
			for (var i = 0; i < self.oldSelectedSize; i++) {
				for (var j = 0; j < self.oldSelectedSize; j++) {
					blocks.getBlock(oBlock.x + i - oldMid, oBlock.y + j - oldMid).hovering = undefined;
					renderer.drawBlock(oBlock.x + i - oldMid, oBlock.y + j - oldMid);
				}
			}
		}
		if (nBlock) {
			const size = self.selectedItem.range;
			const mid = Math.floor((size - 0.5) / 2);
			hoveringRect = renderer.addRectangle(nBlock.x - mid, nBlock.y - mid, size, size, self.selectedItem.borderColor);
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					blocks.getBlock(nBlock.x + i - mid, nBlock.y + j - mid).hovering = true;
					renderer.drawBlock(nBlock.x + i - mid, nBlock.y + j - mid);
				}
			}
			// renderer.getCtx().strokeRect((nBlock.x + renderer.offsetX - mid) * renderer.blockSize + 1, (nBlock.y + renderer.offsetY - mid) * renderer.blockSize + 1, renderer.blockSize * size - 2, renderer.blockSize * size - 2);
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

	function itemActivated() {
		if (self.selectedItem.leavesRect) {
			// Select the icon to use
			var icon = undefined;
			switch (self.selectedItem) {
				case Items.FREEZE: icon = renderer.images.item_freeze; break;
				case Items.BLURRED_VISION: icon = renderer.images.item_bvision; break;
			}
			console.log(Images.flag_green);
			renderer.getRectangle(hoveringRect).setIcon(icon);
			hoveringRect = undefined;
		}
		self.selectedItem = undefined;
		self.oldHoveringBlock = self.newHoveringBlock;
		self.newHoveringBlock = undefined;
		self.hoveringBlockUpdated();
	}

	function useSocketHandler(newSocketHandler) {
		socketHandler = newSocketHandler;
	}

	this.setRenderer = function(rendererToUse) {
		renderer = rendererToUse;
	}

	this.clickBlock = clickBlock;
	this.flagBlock = flagBlock;
	this.removeFlag = removeFlag;
	this.getBlocks = getBlocks;
	this.updateWorld = updateWorld;
	this.hoveringBlockUpdated = hoveringBlockUpdated;
	this.selectItem = selectItem;
	this.useSocketHandler = useSocketHandler;
	this.giveRadarInfo = giveRadarInfo;
}
