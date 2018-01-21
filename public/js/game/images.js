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

	this.n = [];
	for (var i = 0; i < 9; i++) {
		this.n[i] = new Image();
		this.n[i].src = location + i + ".png";
	}
}
