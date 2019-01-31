var Protocol = require('../protocol');
var Block = require('../block');

const range = 10;
const probability = 1; // 1/n

module.exports.getId = function() {
	return Protocol.ITEM_BLURRED_VISION;
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
				block = new Block();
			}

			if (Math.floor(Math.random() * probability) === 0) {
				block.blurBy(username);
				room.blocks.setBlock(blockX, blockY, block);
				updates.push({x: blockX, y: blockY, block: block});
			}
		}
	}

	for (var i = 0; i < room.players.length; i++) {
		var player = room.players[i];
		var convertedUpdates = room.convertBlocksToSendable(updates, player.username);
		socket.to(player.id).emit('update-world', {updates: convertedUpdates});
	}
};
