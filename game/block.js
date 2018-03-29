function Block() {
	var self = this;
	this.isUndefinedBlock = false;
	this.expanded = false;
	this.flagColor = "";
	this.n = 0;
	this.exploadedMine = "";
	var isProtected = false;
	var mine = false;
	var radarBy = [];
	var blurredBy = [];

	this.protect = function() {
		isProtected = true;
		// self.flagColor = "purple";
	}

	this.isProtected = function() {
		return isProtected;
	}

	this.setMine = function() {
		mine = true;
		// self.flagColor = "red";
	}

	this.isMine = function() {
		return mine;
	}

	this.blurBy = function(username) {
		if (!blurredBy.includes(username))
			blurredBy.push(username);
	}

	this.isBlurredFor = function(username) {
		return (blurredBy.length > 0) && !blurredBy.includes(username);
	}

	this.useRadar = function(username) {
		if (!radarBy.includes(username))
			radarBy.push(username);
	}

	this.hasUsedRadar = function(username) {
		return radarBy.includes(username);
	}
}

module.exports = Block;
