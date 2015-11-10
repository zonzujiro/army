"use strict"

class Pathfinder {
    constructor(field) {
        this.field = field;
        this.directions = {
            "n": new Cell(0, -1),
            "e": new Cell(1, 0),
            "s": new Cell(0, 1),
            "w": new Cell(-1, 0),
            "ne": new Cell(1, -1),
            "se": new Cell(1, 1),
            "sw": new Cell(-1, 1),
            "nw": new Cell(-1, -1)
        };

        this.stepCounter;
        this.checkedCells;
        this.lastCheckedCells;
        this.mapOfPaths;
        this.shortestRoute;
    }
    
    nullMapOfPaths() {
        for (var i = 0; i < this.field.map.length; i++) {
            this.mapOfPaths.push(null);
        }
    }
    
    calculateRoute(start) {
        this.shortestRoute = [];
        this.lastCheckedCells = [];
        this.mapOfPaths = [];
        this.stepCounter = 0;
        this.checkedCells = 1;
        
        this.nullMapOfPaths();
        this.mapOfPaths[start] = this.stepCounter;
        this.lastCheckedCells.push(start);
        
        this.startWave();
        this.findRouteToClosestEnemy(start);
        // this.drawMapOfPaths();
        
        // console.log(this.shortestRoute);
        
        return this.shortestRoute.reverse();
    };
    
    isInsideX(num) {
        return num >= 0 && num < this.field.width;
    }
    
    isInsideY (num) {
        return num >= 0 && num < this.field.height;
    }
    
    findRouteToClosestEnemy(selfPosition) {
        var counter = 0;
        var self = this.field.map[selfPosition].unit;
        var enemies = this.field.objectsOnField.units.filter(function (e) { return e != self; } );
        var locationsOfEnemies = [];
        var waypoints = [];
        
        for (var i = 0; i < enemies.length; i++) {
            locationsOfEnemies.push(this.field.convertToIndex(enemies[i].location.x, enemies[i].location.y));
        }
        
        this.shortestRoute.push(locationsOfEnemies[counter]);
        this.shortestRoute = this.addWaypoints(locationsOfEnemies[counter], selfPosition, this.shortestRoute);
                
        for ( counter = 1; counter < locationsOfEnemies.length; counter++) {
            waypoints.push(locationsOfEnemies[counter]);
            waypoints = this.addWaypoints(locationsOfEnemies[counter], selfPosition, waypoints);

            if (waypoints.length < this.shortestRoute.length) {
                this.shortestRoute = waypoints;
            }
            waypoints = [];
        }
        
        for (var i = 0; i < this.shortestRoute.length; i++) {
            this.mapOfPaths[this.shortestRoute[i]] = true;
        }
    }
    
    addWaypoints(cell, start, waypoints) {
        var x, y, index;
        var last = waypoints.length - 1;
        
        for (var value in this.directions) {
            x = this.field.map[cell].x + this.directions[value].x;
            y = this.field.map[cell].y + this.directions[value].y;
            
            if (this.isInsideX(x) && this.isInsideY(y)) {
                index = this.field.convertToIndex(x, y);
                
                if (this.mapOfPaths[index] != NaN && this.mapOfPaths[index] < this.mapOfPaths[waypoints[last]]) {
                    waypoints.push(index);
                    break;
                }
            }
        }
        
        last = waypoints.length - 1;
        
        if (waypoints[last] != start) {
            this.addWaypoints(waypoints[last], start, waypoints);
        } 
        
        return waypoints;
    }
    
    drawMapOfPaths() {
        var html = "";
        
        for (var i = 0; i < this.mapOfPaths.length; i++) {
            html += "<div class = 'cell'>" + this.mapOfPaths[i] + '</div>';
        }
        $("#map").html(html);
    }
    
    startWave() {
        var cellsToCheck = [];
        
        if (this.checkedCells < this.field.map.length) {
            this.stepCounter += 1;
            this.cellsToCheck = this.lastCheckedCells;
            this.lastCheckedCells = [];
            
            for (var i = 0; i < this.cellsToCheck.length; i++) {
                this.scanObstacles(this.cellsToCheck[i]);
            }
            this.startWave();
        }
    }
    
    scanObstacles(cell) {
        var x, y, index;
        var scanned = [];
        var self = this;
        
        function isChecked (index) {
            return self.mapOfPaths[index] != null;
        }
        
        function isLandscape (index) {
            return self.field.map[index].landscape != null;
        }
        
        for (var value in this.directions) {
            x = this.field.map[cell].x + this.directions[value].x;
            y = this.field.map[cell].y + this.directions[value].y;
        
            if (this.isInsideX(x) && this.isInsideY(y)) {
                index = this.field.convertToIndex(x, y);
                
                if (!isChecked(index)) {
                    this.checkedCells += 1;
                    
                    if (!isLandscape(index)) {
                        scanned.push(index);
                    } else {
                        this.mapOfPaths[index] = NaN;
                    }
                }
            }
        }
        
        for (var i = 0; i < scanned.length; i++) {
            this.mapOfPaths[scanned[i]] = this.stepCounter;
        }
        this.lastCheckedCells = this.lastCheckedCells.concat(scanned);        
    }
}