var Protocol = require('../protocol');
var Block = require('../block');

var range = 3;

module.exports.getId = function() {
	return Protocol.ITEM_RADAR;
};

module.exports.useItem = function(room, selection, username, socket) {
	updates = [];
	const mid = Math.floor((range - 0.5) / 2);
	for (var i = 0; i < range; i++) {
		for (var j = 0; j < range; j++) {
			var blockX = selection.x + i - mid;
			var blockY = selection.y + j - mid;
			var block = room.blocks.getBlock(blockX, blockY);

			if (block.isUndefinedBlock) {
				var block = new Block();
				room.blocks.setBlock(blockX, blockY, block);
			}

			block.useRadar(username);
			updates.push({x: blockX, y: blockY, block: block});

			var convertedUpdates = room.convertBlocksToSendable(updates, username);
			socket.emit('update-world', {updates: convertedUpdates});
		}
	}
};
