function Images() {
	var location = "/images/game/";
	this.unexpanded = new Image();
	this.unexpanded.src = location + "unexpanded.png";

	this.flag_red = new Image();
	this.flag_red.src = location + "flag_red.png";

	this.flag_green = new Image();
	this.flag_green.src = location + "flag_green.png";

	this.flag_purple = new Image();
	this.flag_purple.src = location + "flag_purple.png";

	this.flag_yellow = new Image();
	this.flag_yellow.src = location + "flag_yellow.png";

	this.mine_red = new Image();
	this.mine_red.src = location + "mine_red.png";

	this.mine_green = new Image();
	this.mine_green.src = location + "mine_green.png";

	this.mine_purple = new Image();
	this.mine_purple.src = location + "mine_purple.png";

	this.mine_yellow = new Image();
	this.mine_yellow.src = location + "mine_yellow.png";

	this.radar0 = new Image();
	this.radar0.src = location + "radar0.png";

	this.radar1 = new Image();
	this.radar1.src = location + "radar1.png";

	this.blurred = new Image();
	this.blurred.src = location + "blurred.png";

	this.n = [];
	for (var i = 0; i < 9; i++) {
		this.n[i] = new Image();
		this.n[i].src = location + i + ".png";
	}

	this.n[9] = new Image();
	this.n[9].src = location + "blurred.png";
}
