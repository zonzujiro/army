'use strict'

class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.imgX;
        this.imgY;
    }
    
    distance(loc) {
        return Math.floor(Math.hypot(this.x - loc.x, this.y - loc.y));
    }
}