"use strict"

class Cell {
	constructor(x, y) {
		this.x = x;
        this.y = y;
        this.unit = null;
        this.path = false;
        this.imgX = x * 30;
        this.imgY = y * 30;
	}
	
	distance(loc) {
        return Math.floor(Math.hypot(this.x - loc.x, this.y - loc.y));
    }
    
    toString() {
        if (this.unit == null) {
            return " ";
        }
        return this.unit.icon;
    }
}