var Protocol = require('../protocol');

module.exports.getId = function() {
	return Protocol.ITEM_FREEZE;
};

module.exports.useItem = function(blocks, selection) {
	return [];
};
