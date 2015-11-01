"use strict"

class Field {
    constructor(ui, blueprint, factory) {
        this.width = 20;
        this.height = 10;
        this.cellSize = 60;
        
        this.map = [];
        this.createMap();
        
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
        
        this.factory = factory;
        this.ui = ui;
        this.ui.field = this;
        this.finder = new Pathfinder(this);

        this.addLandscape(blueprint);
        this.ui.draw();
    }

    addLandscape(blueprint) {
        var row, index;
        var landscape, image;
        
        for (var y = 0; y < blueprint.length; y++) {
            row = blueprint[y];
            
            for (var x = 0; x < row.length; x++) {
                index = this.convertToIndex(x, y);
                
                if (row[x] == " ") {
                    continue;
                }
                
                landscape = this.factory.map.history[row[x]]();
                image = this.factory.images[row[x]]();
                
                image.setCoordinates(this.map[index].x, this.map[index].y);
                landscape.location = this.map[index];
                this.map[index].landscape = landscape;
                this.objectsOnField.landscape.push(landscape);
                this.ui.addImageOfLandscape(image);                
            }
        }
    }

    addUnit(unit, index) {
        unit.location = this.map[index];
        this.map[index].unit = unit;
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
                checked.push(this.map[this.convertToIndex(x, y)]);
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

    findPathToEnemy(currentLocation) {
        var index = this.convertToIndex(currentLocation.x, currentLocation.y);

        return this.finder.calculateRoute(this.convertToIndex(currentLocation.x, currentLocation.y), currentLocation);
    }

    moveUnit(unit, index) {
        this.map[index].unit = null;
        unit.location = this.map[index];
    }

    start() {
        var limit = this.objectsOnField.units.length - 1;
        var self = this;
        var counter = -1;
        var unit;
        
        function turn() {
            if (counter < limit) {
                counter += 1;
            } else {
                counter = 0;
            }
            
            unit = self.objectsOnField.units[counter];
            
            if (self.objectsOnField.units.length > 1) {
                unit.act();
                self.refreshMap();
            }
            
            if (self.objectsOnField.units.length > 1) {
                console.log("----- Turn ended");
                self.ui.changeCanvas(unit, counter).done(turn());
            } else {
                self.ui.endGame();
                self.ui.draw();
            }            
        }
        turn();
    }     
}