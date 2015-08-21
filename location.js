function Location(x, y) {
    this.x = x;
    this.y = y;
    this.unit = null;
};

Location.prototype.getX = function () {
    return this.x;
};

Location.prototype.getY = function () {
    return this.y;
};

Location.prototype.getUnit = function () {
    return this.unit;
};

Location.prototype.setUnit = function (unit) {
    this.unit = unit;
};

Location.prototype.distance = function (loc) {
    return Math.floor(Math.hypot(this.x - loc.x, this.y - loc.y));
};

Location.prototype.toString = function () {
    if (this.unit == null) {
        return " ";
    }
    return this.unit.getIcon();
};