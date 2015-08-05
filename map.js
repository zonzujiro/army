function Map () {
	this.map = [][];
	this.acted = [];
	this.height = 8;
	this.width = 8;
	this.numberOfUnits = 0;
	
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
}

Map.prototype.isInside = function(num) {
	return num >= 0 && num < this.height;
};

Map.prototype.addUnit = function(unit, x, y) {
	if (map[x][y].getUnit() != null) {
		throw new LocationAllreadyHaveUnitException();
	}
	map[x][y].setUnit(unit);
	unit.setMap(this);
	numberOfUnits += 1;
};

Map.prototype.draw = function() {
   var html = '';
   var i = 0;

    for (var x = 0; i < width; x++) {
    	for (var y = 0; y < height; y++) {
        	html += '<div id="' + i + '" class="cell">' + map[x][y].type + '</div>';
        	i += 1; 		
    	}
    }

    $('#map').html(html);
};

Map.prototype.checkEnemies = function(unitX, unitY, attackDistance) {
	for (value in directions) {
            int x = unitX + value.getX() * attackDistance;
            int y = unitY + value.getY() * attackDistance;
            
            if (isInside(x) && isInside(y)) {
                if (field[x][y].getUnit() != null) {
                    return field[x][y].getUnit();
                }
            }
        }
    return null;
};

Map.prototype.checkArea = function(x, y, actionPoints) {
    var targetX, targetY, directionX, directionY;    
    var target;
    
    for (var i = 1; i <= actionPoints; actionPoints--) {    
    	for (value in directions) {
    		targetX = x + value.getX() * i;
    		targetY = y + value.getY() * i;
			directionX = x + value.getX();
			directionY = y + value.getY();

			if (isInside(targetX) && isInside(targetY) && isInside(directionX) && isInside(directionY)) {
				if (map[directionX][directionY].getUnit() == null) {
				    target = map[directionX][directionY];
				}

				if (map[targetX][targetY].getUnit() != null && map[directionX][directionY].getUnit() == null) {                  
				    return map[directionX][directionY];
				}                
			}
		}
	}
	return target;    
};

Map.prototype.turn = function() {
	var unit;
	
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			unit = map[x][y].getUnit();
			
			if (unit != null && acted.indexOf(unit) == -1) {
				unit.act(x, y);
				acted.push(unit);
			}			
		}
	}	
};

Map.prototype.removeUnit = function(unit) {
	searchUnit(unit).setUnit(null);
	numberOfUnits -= 1;
};

Map.prototype.nearestEnemies = function() {
	// body...
};

Map.prototype.searchUnit = function(unit) {
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			if (map[x][y].getUnit() == unit) {
				return map[x][y];
			}			
		}
	}
};

Map.prototype.start = function() {
	for ( ; numberOfUnits > 1; ) {
		turn();
		this.acted = [];
	}
};


function Location(x, y) {
    this.x = x;
    this.y = y;
    this.unit = null;
};

Location.prototype.getX = function() {
	return this.x;
};

Location.prototype.getY = function() {
	return this.y;
};

Location.prototype.getUnit = function() {
	return this.unit;
};

Location.prototype.setX = function(value) {
	this.x = value;
};

Location.prototype.setY = function(value) {
	this.y = value;
};

Location.prototype.setUnit = function(unit) {
	this.unit = unit;
};

Location.prototype.distance = function(loc) {
	return Math.floor(Math.hypot(this.x - loc.x, this.y - loc.y));
};

Location.prototype.toString = function() {
	if (this.unit = null) {
		return "";
	}
	return unit.getIcon();
};