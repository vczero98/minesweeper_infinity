function Block() {
	var self = this;
	this.isUndefinedBlock = false;
	this.expanded = false;
	this.flagColor = "";
	this.n = 0;
	var isProtected = false;
	var mine = false;

	this.protect = function() {
		isProtected = true;
		self.flagColor = "purple";
	}

	this.isProtected = function() {
		return isProtected;
	}

	this.setMine = function() {
		mine = true;
		self.flagColor = "red";
	}

	this.isMine = function() {
		return mine;
	}
}

module.exports = Block;
