function Rectangle(x, y, height, width, color, id) {
	var id = id;
	var x = x;
	var y = y;
	var height = height;
	var width = width;
	var color = color;
	var icon;

	this.getId = function() {
		return id;
	}

	this.getX = function() {
		return x;
	}

	this.getY = function() {
		return y;
	}

	this.getHeight = function() {
		return height;
	}

	this.getWidth = function() {
		return width;
	}

	this.getColor = function() {
		return color;
	}

	this.setIcon = function(newIcon) {
		icon = newIcon;
	}

	this.getIcon = function() {
		return icon;
	}
}
