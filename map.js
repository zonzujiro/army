"use strict"

class Field {
    constructor(userInterface) {
        this.width = 40;
        this.height = 20;
        this.cellSize = 30;
        
        this.userInterface = userInterface;
        this.userInterface.map = this;
        
        this.map = [];
        this.acted = [];
        this.unitsInBattle = [];
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

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.map.push(new Cell(x, y));
            }
        }
        this.drawGrid();
        this.userInterface.drawCanvas(this.unitsInBattle);
    }
    
    addUnit(unit, clickedX, clickedY) {
        this.writeCoordinatesInUnit(unit, clickedX, clickedY);
        unit.map = this;
        this.drawGrid();
        this.userInterface.drawCanvas(this.unitsInBattle);
    }
    
    writeCoordinatesInUnit(unit, clickedX, clickedY) {
        let x = parseInt(clickedX / this.cellSize);
        let y = parseInt(clickedY / this.cellSize);
        let index = x + y * this.width;
        
        console.log("map.js  [x: " + x + " y: " + y + " index: " + index + "]");
        
        unit.location = new Location(x, y);
        unit.location.imgX = this.map[index].imgX;
        unit.location.imgY = this.map[index].imgY;
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
    
    drawGrid() {
        var width = 20,
            height = 10;
        var html = '';
        // var index = 0;
        
        for (let i = 0; i < this.map.length; i++) {
            this.map[i].unit = null;
        }
        
        for (var i = 0; i < this.unitsInBattle.length; i++) {
            let index = this.unitsInBattle[i].location.x + this.unitsInBattle[i].location.y * this.width;
            
            console.log("map.js  [x: " + this.unitsInBattle[i].location.x + " y: " + this.unitsInBattle[i].location.y + " index: " + index + "]");
            this.map[index].unit = this.unitsInBattle[i];
        }        
                    
        // for (let k = 0; k < width; k++) {
        //     for (let z = 0; z < height; z++, index++) {
        //         // html += '<div id="x:' + this.map[index].x + ' y:' + this.map[index].y + ' index:' + index + '" class="cell">' + this.map[index].toString() + '</div>';
        //         html += '<div id="' + index + '" class="cell">' + this.map[index].toString() + '</div>';
        //     }
        // }

        // $("#map").html(html);
    }
    
    searchAllEnemies(self) {
        return this.unitsInBattle.filter(function (enemy) {
            return enemy != self;
        });
    }
    
    removeUnit(unit) {
        this.searchUnitLocation(unit).unit = null;
        this.unitsInBattle.splice(this.unitsInBattle.indexOf(unit), 1);
        this.drawGrid();
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

        index = currentX + currentY * this.width;

        return this.map[index];
    }
    
    start() {
        for (let i = 0; i < this.map.length; i++) {
            var unit = this.map[i].unit;
            
            if (this.unitsInBattle.length > 1 && unit != null && this.acted.indexOf(unit) == -1) {
                unit.act(this.map[i]);
                this.acted.push(unit);
                this.drawGrid();
            }
        }

        this.acted = [];

        if (this.unitsInBattle.length > 1) {
            this.userInterface.drawCanvas(this.unitsInBattle);
            setTimeout(this.start.bind(this), 666);
        } else {
            this.userInterface.endGame();
            this.userInterface.drawCanvas(this.unitsInBattle);
        }
    }
}
