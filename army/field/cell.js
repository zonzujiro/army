"use strict"

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.imgX = x * 60;
        this.imgY = y * 60;

        this.unit = null;
        this.landscape = null;
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