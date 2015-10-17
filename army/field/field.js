"use strict"

class Field {
    constructor(ui, blueprint, factory) {
        this.width = 20;
        this.height = 10;
        this.cellSize = 60;

        this.factory = factory;
        this.ui = ui;
        this.ui.field = this;

        this.map = [];
        this.objectsOnField = {
            units: [],
            landscape: []
        };
        
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

        this.createMap();
        this.addLandscape(blueprint);
        this.ui.draw();
    }
    
    addLandscape(blueprint) {
        for (var i = 0; i < blueprint.length; i++) {
            var index = this.convertToIndex(this.map[blueprint[i]].x, this.map[blueprint[i]].y);
            var landscape = this.factory.map.history["*"]();
            var image = this.factory.images.mountain();
            
            image.setCoordinates(this.map[index].x, this.map[index].y);
            landscape.location = this.map[index];
            this.map[index].path = false;
            this.objectsOnField.landscape.push(landscape);
            this.ui.addImageOfLandscape(image);
        }
    }    

    addUnit(unit, index) {
        unit.location = this.map[index];
        unit.field = this;
        this.objectsOnField.units.push(unit);
        this.ui.draw();
    }
    
    createMap() {
        for (var y = 0, i = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++, i++) {
                this.map.push(new Cell(x, y));
            }
        }        
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
        for (let i = 0; i < this.objectsOnField.units.length; i++) {
            let index = this.convertToIndex(this.objectsOnField.units[i].location.x, this.objectsOnField.units[i].location.y);

            this.map[index].unit = this.objectsOnField.units[i];
        }
    }

    searchAllEnemies(self) {
        return this.objectsOnField.units.filter(function (enemy) {
            return enemy != self;
        });
    }

    removeUnit(unit, index) {
        this.map[index].unit = null;
        this.objectsOnField.units.splice(this.objectsOnField.units.indexOf(unit), 1);
    }

    findPathToEnemy(currentLocation, targetLocation) {
        var currentX = currentLocation.x,
            currentY = currentLocation.y;
        var targetX = targetLocation.x,
            targetY = targetLocation.y;
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

    moveUnit(unit, loc) {
        let index = this.convertToIndex(loc.x, loc.y);
        
        this.map[index].unit = null;
        unit.location = this.map[index];
        // this.refreshMap();
        
        return $.Deferred().resolve();
    }

    start() {
        var limit = this.objectsOnField.units.length - 1;
        var self = this;
        var index = -1;
        var unit;
        
        function turn() {
            if (index < limit) {
                index += 1;
            } else {
                index = 0;
            }
            
            unit = self.objectsOnField.units[index];
            
            if (self.objectsOnField.units.length > 1) {
                unit.act();
                self.refreshMap();
            }
            
            if (self.objectsOnField.units.length > 1) {
                self.ui.drawFrame(unit, index).done(turn());
            } else {
                self.ui.endGame();
                self.ui.draw();
            }            
        }
        turn();
    }     
}