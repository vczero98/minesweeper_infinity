var Radar = require('./radar');
var Freeze = require('./freeze');
var WeightlessShoes = require('./weightlessshoes');
var BlurredVision = require('./blurredVision');
var LuckyMoves = require('./luckyMoves');
var Protocol = require('../protocol');

module.exports.getItem = function(id) {
	switch (id) {
		case Protocol.ITEM_RADAR: return Radar;
		case Protocol.ITEM_FREEZE: return Freeze;
		case Protocol.ITEM_WEIGHTLESS_SHOES: return WeightlessShoes;
		case Protocol.ITEM_BLURRED_VISION: return BlurredVision;
		case Protocol.ITEM_LUCKY_MOVES: return LuckyMoves;
	}
}
