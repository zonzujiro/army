"use strict"

class Cell {
	constructor(x, y, size) {
		this.x = x;
        this.y = y;
        this.imgX = x * size;
        this.imgY = y * size;
        
        this.unit = null;
        this.landscape = null;
        this.path = true;
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