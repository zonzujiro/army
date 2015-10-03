"use strict"

class Field {
    constructor(ui, blueprint) {
        this.width = 20;
        this.height = 10;
        this.cellSize = 60;
        
        this.ui = ui;
        this.ui.field = this;
        
        this.map = [];       
        this.units = [];
        this.objectsOnMap = [];
        
        this.directions = {
            "n": new Cell(0, -1),
            "ne": new Cell(1, -1),
            "e": new Cell(1, 0),
            "se": new Cell(1, 1),
            "s": new Cell(0, 1),
            "sw": new Cell(-1, 1),
            "w": new Cell(-1, 0),
            "nw": new Cell(-1, -1)
        };
        
        for (var y = 0, i = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++, i++) {
                this.map.push(new Cell(x, y, this.cellSize));
            }
        }
        
        for (var i = 0; i < blueprint.length; i++) {
            let landscape = this.ui.map.history["*"]();
            let index = this.convertToIndex(this.map[blueprint[i]].x, this.map[blueprint[i]].y);
            
            landscape.location = this.map[index];
            this.map[index].path = false;
            this.objectsOnMap.push(landscape);      
        }
        
        this.refreshMap();
        this.ui.drawCanvas(this.objectsOnMap);
    }
    
    addUnit(unit, index) {
        unit.location = this.map[index];
        unit.map = this;
        this.objectsOnMap.push(unit);
        this.units.push(unit);
        this.refreshMap();
        this.ui.drawCanvas(this.objectsOnMap);
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
                index = this.convertToIndex(x, y);

                if (this.map[index].unit == null) {
                    checked.push(this.map[index]);
                }
            }
        }
        return checked;
    }
    
    convertToIndex(x, y) {
        return x + y * this.width;
    }
    
    refreshMap() {
        for (let i = 0; i < this.objectsOnMap.length; i++) {
            let index = this.convertToIndex(this.objectsOnMap[i].location.x, this.objectsOnMap[i].location.y);
            
            this.map[index].unit = this.objectsOnMap[i];
        }
    }
    
    searchAllEnemies(self) {
        return this.units.filter(function (enemy) {
            return enemy != self;
        });
    }
    
    removeUnit(unit, index) {
        this.map[index].unit = null;
        this.objectsOnMap.splice(this.objectsOnMap.indexOf(unit), 1);
        this.units.splice(this.units.indexOf(unit), 1);
        this.refreshMap();
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

        index = this.convertToIndex(currentX, currentY);

        return this.map[index];
    }
    
    moveToLocation(unit, loc) {
        let index = this.convertToIndex(loc.x, loc.y);

        this.removeUnit(unit, index);
        this.addUnit(unit, index);
    }
    
    start() {
        let acted = [];
        
        for (let i = 0; i < this.units.length; i++) {    
            if (this.units.length > 1 && acted.indexOf(this.units[i]) == -1) {
                this.units[i].act();
                acted.push(units[i]);
                this.refreshMap();
            }
        }
        
        this.ui.drawCanvas(this.objectsOnMap);
        
        if (this.units.length > 1) {
            setTimeout(this.start.bind(this), 666);
        } else {
            this.ui.endGame();
            this.ui.drawCanvas(this.objectsOnMap);
        }
    }
}
