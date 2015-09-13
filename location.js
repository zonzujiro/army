'use strict'

class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.unit = null;
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