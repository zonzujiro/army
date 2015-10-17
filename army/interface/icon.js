"use strict"

class Icon {
	constructor(img) {
		this.img = img;
		this.x;
		this.y;
	}
	
	setCoordinates(x, y) {
		this.x = x * 60;
		this.y = y * 60;
	}
}