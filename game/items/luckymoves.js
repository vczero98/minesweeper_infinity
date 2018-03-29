var Protocol = require('../protocol');

module.exports.getId = function() {
	return Protocol.ITEM_LUCKY_MOVES;
};

module.exports.useItem = function(blocks, selection) {
	return [];
};
