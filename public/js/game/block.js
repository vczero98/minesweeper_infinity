// class Block {
// 	constructor() {
// 		this.isUndefinedBlock = false;
// 		this.expanded = false;
// 		this.isMine = false;
// 		this.flagged = false;
// 		this.n = 0;
// 		this.protected = false;
// 		this.losingBlock = false;
// 	}
//
// 	incrementN() {
// 		this.n += 1;
// 	}
// }
function Block() {
	this.isUndefinedBlock = false;
	this.expanded = false;
	this.flagColor = "";

	function isFlagged() {
		return !(this.flagColor === "");
	}

	Block.prototype.isFlagged = isFlagged;
}
