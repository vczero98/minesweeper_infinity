var Protocol = require('../protocol');

var range = 5;

module.exports.getId = function() {
	return Protocol.ITEM_RADAR;
};

module.exports.useItem = function(room, selection, username, socket) {
	radarRange = [];
	const mid = Math.floor((range - 0.5) / 2);
	for (var i = 0; i < range; i++) {
		for (var j = 0; j < range; j++) {
			var blockX = selection.x + i - mid;
			var blockY = selection.y + j - mid;
			var block = room.blocks.getBlock(blockX, blockY);
			if (!block.isUndefinedBlock && block.isMine()) {
				radarRange.push({x: blockX, y: blockY, r: true});
			} else {
				radarRange.push({x: blockX, y: blockY, r: false});
			}
		}
	}
	socket.emit('item-radar', {radarRange: radarRange});
};
