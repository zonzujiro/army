"use strict"

class Map {
    constructor(userInterface) {
        this.userInterface = userInterface;
        this.userInterface.map = this;
        this.numberOfUnits = 0;
        this.map = [];
        this.acted = [];
        this.directions = {
            "n": new Location(0, -1),
            "ne": new Location(1, -1),
            "e": new Location(1, 0),
            "se": new Location(1, 1),
            "s": new Location(0, 1),
            "sw": new Location(-1, 1),
            "w": new Location(-1, 0),
            "nw": new Location(-1, -1)
        };

        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                this.map.push(new Location(x, y));
            }
        }
        this.draw();
    }
    
    addUnit(unit, index) {
        this.map[index].unit = null;
        this.map[index].unit = unit;
        unit.map = this;
        this.numberOfUnits += 1;
        this.draw();
    }
    
    draw() {
        var total = 8;
        var index = this.map.length - total;
        var width = 8,
            height = 8;
        var html = '';

        for (let k = 0; k < width; k++) {
            for (let z = 0; z < height; z++, index++, total++) {
                // html += '<div id="x:' + this.map[index].x + ' y:' + this.map[index].y + ' index:' + index + '" class="cell">' + this.map[index].toString() + '</div>'; test of coordinate drawing
                html += '<div id="' + index + '" class="cell">' + this.map[index].toString() + '</div>';
            }
            index = this.map.length - total;
        }

        $("#map").html(html);
    }
    
    checkAreaAround(loc) {
        var x, y, index, checked = [];

        function isInside(num) {
            return num >= 0 && num < 8;
        }

        for (let value in this.directions) {
            x = loc.x + this.directions[value].x;
            y = loc.y + this.directions[value].y;

            if (isInside(x) && isInside(y)) {
                index = x + y * 8;

                if (this.map[index].unit == null) {
                    checked.push(this.map[index]);
                }
            }
        }
        return checked;
    }
    
    moveToLocation(unit, loc) {
        var index = loc.x + loc.y * 8;

        this.removeUnit(unit);
        this.addUnit(unit, index);
    }
    
    searchAllEnemies(self) {
        return this.map.filter(function (loc) {
            return loc.unit != null && loc.unit != self;
        });
    }
    
    removeUnit(unit) {
        this.searchUnitLocation(unit).unit = null;
        this.numberOfUnits -= 1;
        this.draw();
    }
    
    searchUnitLocation(unit) {
        for (let i = 0; i < this.map.length; i++) {
            if (this.map[i].unit == unit) {
                return this.map[i];
            }
        }
    }
    
    findPathToEnemy(current, target) {
        var currentX = current.x,
            currentY = current.y;
        var targetX = target.x,
            targetY = target.y;
        var index;

        if (currentX < targetX) {
            currentX += 1;
        } else if (currentX > targetX) {
            currentX -= 1;
        }

        if (currentY < targetY) {
            currentY += 1;
        } else if (currentY > targetY) {
            currentY -= 1;
        }

        index = currentX + currentY * 8;

        return this.map[index];
    }
    
    start() {
        for (let i = 0; i < this.map.length; i++) {
            var unit = this.map[i].unit;
            
            if (this.numberOfUnits > 1 && unit != null && this.acted.indexOf(unit) == -1) {
                unit.act(this.map[i]);
                this.acted.push(unit);
                this.draw();
            }
        }

        this.acted = [];

        if (this.numberOfUnits > 1) {
            setTimeout(this.start.bind(this), 666);
        } else {
            this.draw();
            this.userInterface.endGame();
        }
    }
}
