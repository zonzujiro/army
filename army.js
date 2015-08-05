$(function() {	
	function Map () {
		this.map = [];
		this.acted = [];	 
		this.height = 8;
		this.width = 8;
		this.numberOfUnits = 0;
		
		// this.directions = {
		//     "n": new Location(0, -1),
		//     "ne": new Location(1, -1),
		//     "e": new Location(1, 0),
		//     "se": new Location(1, 1),
		//     "s": new Location(0, 1),
		//     "sw": new Location(-1, 1),
		//     "w": new Location(-1, 0),
		//     "nw": new Location(-1, -1)
		// };
	}

	Map.prototype.isInside = function(num) {
		return num >= 0 && num < this.height;
	};

	Map.prototype.addUnit = function(unit, index) {
		if (map[index].getUnit() != null) {
			throw new LocationAllreadyHaveUnitException();
		}
		map[index].setUnit(unit);
		unit.setMap(this);
		numberOfUnits += 1;
	};

	Map.prototype.draw = function() {
	   var html = '';
	   
	   console.log(typeof this.acted);
	   
	   for (var k = 0; k < 64; k++) {
	   		this.map.push(new Location(i));
	   }
	   
	   console.log(map.length);

	    for (var i = 0; i < map.length; i++) {   	
	    	html += '<div id="' + i + '" class="cell">' + map[i].toString() + '</div>';
	    }

	    $('#map').html(html);
	};

	// Map.prototype.checkEnemies = function(index, attackDistance) {
	// 	for (value in directions) {
	//             int x = unitX + value.getX() * attackDistance;
	//             int y = unitY + value.getY() * attackDistance;
	            
	//             if (isInside(x) && isInside(y)) {
	//                 if (field[x][y].getUnit() != null) {
	//                     return field[x][y].getUnit();
	//                 }
	//             }
	//         }
	//     return null;
	// };

	Map.prototype.checkDestination = function(limit, delta, current) {	
		for (var i = limit; i > 0; i--) {
	        current += delta;
	        
	        if (current > 0 && current < 64) {
	            if (map[current].getUnit != null) {                    
	            	return current;
	            }                                 
	            checkedMoves.push(current);
	        }
	    }
	    checkedMoves.push(current);    
	};

	// Map.prototype.checkArea = function(x, y, actionPoints) {
	//     var targetX, targetY, directionX, directionY;    
	//     var target;
	    
	//     for (var i = 1; i <= actionPoints; actionPoints--) {    
	//     	for (value in directions) {
	//     		targetX = x + value.getX() * i;
	//     		targetY = y + value.getY() * i;
	// 			directionX = x + value.getX();
	// 			directionY = y + value.getY();

	// 			if (isInside(targetX) && isInside(targetY) && isInside(directionX) && isInside(directionY)) {
	// 				if (map[directionX][directionY].getUnit() == null) {
	// 				    target = map[directionX][directionY];
	// 				}

	// 				if (map[targetX][targetY].getUnit() != null && map[directionX][directionY].getUnit() == null) {                  
	// 				    return map[directionX][directionY];
	// 				}                
	// 			}
	// 		}
	// 	}
	// 	return target;    
	// };

	Map.prototype.checkArea = function(index, actionPoints) {
	    var x = index % 8;
	    var y = Math.floor(index / 8);
	    
	    for (var i = 1; i <= actionPoints; actionPoints--) {
		    checkDestination(x, -1, index);
		    checkDestination(7 - actionPoints, 1, index);

		    checkDestination(y, -8, index);
		    checkDestination(7 - actionPoints, 8, index);

		    checkDestination(Math.min(x, y), -9, index);
		    checkDestination(Math.min(7 - actionPoints, y), -7, index);
		    checkDestination(Math.min(x, 7 - actionPoints), 7, index);
		    checkDestination(Math.min(7 - actionPoints, 7 - actionPoints), 9, index);
		}
	};

	Map.prototype.checkEnemies = function() {
		return enemies = map.filter(
				function(loc) {
					return loc.getUnit != null;
				}
			);	
		// for (int i = 1; i <= limit; i++) {
		//     checked.push(checkDestination(x, -1, index));
		//     checked.push(checkDestination(7 - limit, 1, index));

		//     checked.push(checkDestination(y, -8, index));
		//     checked.push(checkDestination(7 - limit, 8, index));

		//     checked.push(checkDestination(Math.min(x, y), -9, index));
		//     checked.push(checkDestination(Math.min(7 - limit, y), -7, index));
		//     checked.push(checkDestination(Math.min(x, 7 - limit), 7, index));
		//     checked.push(checkDestination(Math.min(7 - limit, 7 - limit), 9, index));
		// }
		
		// if (checked.length > 0) {
		// 	return checked;
		// }
		// return null;
	};

	Map.prototype.chooseEnemy = function(loc) {	
		return map.reduce(
			function(prev, current, index, array) {
				return loc.distance(current) > loc.distance(prev) ? prev : current;
			}
		);
	};

	Map.prototype.turn = function() {
		var unit;
		
		for (var i = 0; i < map.length; i++) {	
			unit = map[index].getUnit();
			
			if (unit != null && acted.indexOf(unit) == -1) {
				unit.act(map[index]);
				acted.push(unit);
			}			
		}		
	};

	Map.prototype.removeUnit = function(unit) {
		map[searchUnit(unit)].setUnit(null);
		numberOfUnits -= 1;
	};

	Map.prototype.searchUnit = function(unit) {
		for (var i = 0; i < map.length; i++) {
			if (map[i].getUnit() == unit) {
				return map[i];
			}		
		}
	};

	Map.prototype.start = function() {
		for ( ; numberOfUnits > 1; ) {
			turn();
			this.acted = [];
		}
	};

	function Location(index) {
	    this.index = index;    
	    this.unit = null;
	};

	Location.prototype.getIndex = function() {
		return this.index;
	};

	Location.prototype.getUnit = function() {
		return this.unit;
	};

	Location.prototype.setUnit = function(unit) {
		this.unit = unit;
	};

	Location.prototype.distance = function(loc) {
		var x = index % 8;
		var y = Math.floor(index / 8);	
		var targetX = loc.getIndex() % 8;
		var targetY = Math.floor(loc.getIndex() / 8);
		
		return Math.floor(Math.hypot(x - targetX, y - targetY));
	};

	Location.prototype.toString = function() {
		if (this.unit = null) {
			return "";
		}
		return unit.getIcon();
	};
	
	// html += '<script src="unit.js"></script>';
	// html += '<script src="abilities.js"></script>';
	// html += '<script src="attackmethod.js"></script>';
	// html += '<script src="state.js"></script>';
	// html += '<script src="spellbook.js"></script>';
	// html += '<script src="spell.js"></script>';
	// html += '<script src="attackmethod.js"></script>';
	// html += '<script src="map.js"></script>';
	
	// $("head").html(html);
	
	function Unit(name, hp, dmg) {
	    this.state = new State(name, hp, dmg);
	    this.actionPoints = 4;
	    
	    this.wolfState = null;
	    this.infectPossibility = true;
	    this.isWolf = false;
	    this.isUndead = false;
	    
	    this.icon = " ";
	    this.map = [];
	    this.checkedMoves = [];
	};

	Unit.prototype.ensureIsAlive = function () {
	    if (this.getCurrentHp() == 0) {
	        return false;
	    }
	    return true;
	};

	Unit.prototype.getDamage = function () {
	    return this.state.getStateDamage();
	};

	Unit.prototype.getCurrentHp = function () {
	    return this.state.getStateCurrentHp();
	};

	Unit.prototype.getMaxHp = function () {
	    return this.state.getStateMaxHp();
	};

	Unit.prototype.getName = function () {
	    return this.state.getStateName();
	};

	Unit.prototype.getState = function () {
	    return this.state;
	};

	Unit.prototype.getWolfState = function () {
	    return this.wolfState;
	}

	Unit.prototype.getInfectPossibility = function () {
	    return this.infectPossibility;
	};

	Unit.prototype.getIsWolf = function () {
	    return this.isWolf;
	};

	Unit.prototype.getIsUndead = function () {
	    return this.isUndead;
	}

	Unit.prototype.getIcon = function () {
	    return this.icon;
	};

	Unit.prototype.getLocation = function () {
	    return field.searchUnitLocation(this);
	};

	Unit.prototype.getActionPoints = function () {
	    return this.actionPoints;
	};

	Unit.prototype.getAttackDistance = function () {
	    return attackMethod.getDistance();
	};

	Unit.prototype.changeInfectPossibility = function () {
	    this.infectPossibility = !infectPossibility;
	};

	Unit.prototype.changeIsWolf = function () {
	    this.isWolf = !isWolf;
	};

	Unit.prototype.changeIsUndead = function () {
	    this.isUndead = !isUndead;
	};

	Unit.prototype.setAbility = function (newAbility) {
	    this.state.newStateAbility(newAbility);

	    if (this.wolfState != null) {
	        this.wolfState.newStateAbility(newAbility);
	    }
	};

	Unit.prototype.setAttackMethod = function (newMethod) {
	    this.attackMethod = newMethod;
	};

	Unit.prototype.setName = function setName(newName) {
	    state.newStateName(newName);
	};

	Unit.prototype.setState = function(newState) {
	    this.state = newState;
	}

	Unit.prototype.setWolfState = function(newState) {
	    this.wolfState = newState;
	};

	Unit.prototype.setIcon = function(icon) {
	    this.icon = icon;
	};

	Unit.prototype.addMove = function(value) {
	    this.checkedMoves.push(value);
	};

	Unit.prototype.act = function(currentLocation) {    
	    var index = currentLocation.getIndex();    
	    var target = checkEnemies();
	    
	    if (target.length > 0) {
	        var enemy = target.chooseEnemy(currentLocation);
	        var distanceToEnemy = getLocation().distance(enemy);
	        
	            if (distanceToEnemy <= getAttackDistance()) {
	                attack(enemy.getUnit());
	                return;
	            }
	        
	        attack(target.chooseEnemy(currentLocation.getUnit()));        
	        return;
	    }
	    
	    for (var i = 1; i <= actionPoints; i++) {
	        var dir = map.checkArea(index);
	        
	        if (dir.getUnit() == null) {
	            move(dir);
	            index = getLocation().getIndex();
	        }
	    }
	    
	};

	Unit.prototype.addHitPoints = function(hp) {
	    if (ensureIsAlive()) {
	        this.state.addHp(hp);
	    }
	};

	Unit.prototype.attack = function(enemy) {
	    this.attackMethod.attack(enemy);
	    enemy.counterAttack(this);
	};

	Unit.prototype.counterAttack = function(enemy) {
	    if (!ensureIsAlive()) {
	        return;
	    }

	    this.attackMethod.counterAttack(enemy);
	};

	Unit.prototype.takeDamage = function(dmg) {
	    if (ensureIsAlive()) {
	        this.state.removeHp(dmg);
	    }
	};

	Unit.prototype.takeMagicDamage = function(dmg) {
	    if (ensureIsAlive()) {
	        this.takeDamage(dmg);
	    }
	};

	Unit.prototype.useAbility = function() {
	    if (ensureIsAlive()) {
	        this.state.useAbility();
	    }
	};

	Unit.prototype.toString = function() {
	    return this.getName() + " [HP: " + this.getCurrentHp() + "/" + this.getMaxHp() + " Damage: " + this.getDamage() + "]";
	};

	function Soldier(name, hp, dmg) {
	    Unit.apply(this, arguments);
	    this.attackMethod = new DeffaultAttack(dmg);
	};

	function Berserker(name, hp, dmg) {
	    Unit.apply(this, arguments);
	    this.attackMethod = new DeffaultAttack(dmg);
	};

	Berserker.prototype.takeMagicDamage = function (dmg) {
	    return "Berserker invulnerable to magic";
	};

	Berserker.prototype.addHitPoints = function (hp) {
	    return "Berserker invulnerable to magic";
	};

	function Rogue(name, hp, dmg) {
	    Unit.apply(this, arguments);
	    this.attackMethod = new DeffaultAttack(dmg);
	};

	Rogue.prototype.attack = function (enemy) {
	    enemy.takeDamage(this.dmg);
	};

	function Vampire(name, hp, dmg) {
	    Unit.apply(name, hp, dmg);
	    this.attackMethod = new VampireAttack(this);
	    this.infectPossibility = false;
	    this.isUndead = true;
	    this.setAbility(new Vampirism(this));
	};

	Vampire.prototype.setAbility = function (newAbility) {
	    this.state.newStateAbility(newAbility);
	};

	function Werewolf(name, hp, dmg) {
	    Unit.apply(name, hp, dmg);
	    this.attackMethod = new WerewolfAttack(dmg);
	    this.state = new State(name + " as Human", hp, dmg);
	    this.wolfState = new State(name + " as Wolf", hp * 2, dmg * 2);
	    this.setAbility(new Transformation(this));
	};

	Werewolf.prototype.takeMagicDamage = function (dmg) {
	    if (this.isWolf) {
	        this.takeDamage(dmg * 2);
	    } else {
	        this.takeDamage(dmg);
	    }
	};
	
	function Vampirism(target) {
	this.target = target;
	};

	Vampirism.prototype.action = function() {
		this.target.addHitPoints(this.target.getDamage / 4);
	};

	function Transformation(target) {
		this.target = target;
	};

	Transformation.prototype.action = function() {
		var tmp = this.target.getState();	
		var hpDifference = this.target.getMaxHp() - this.target.getCurrentHp();
		
		this.target.setState(this.target.getWolfState());
		this.target.setWolfState(tmp);
		this.target.changeIsWolf();
		this.target.takeDamage(hpDifference);
	};

	function AttackMethod (dmg) {
		this.dmg = dmg;
	};

	AttackMethod.prototype.attack = function(enemy) {};
	AttackMethod.prototype.counterAttack = function(enemy) {};

	function DefaultAttack(dmg) {
		AttackMethod.apply(this, dmg);
	};

	DefaultAttack.prototype.attack = function(enemy) {
		enemy.takeDamage(dmg);
	};
	DefaultAttack.prototype.counterAttack = function(enemy) {
		enemy.takeDamage(dmg / 2);
	};

	function VampireAttack(self) {
		AttackMethod.apply(this, self.getDamage());
	};

	VampireAttack.prototype.attack = function(enemy) {
		if (enemy.getInfectPossibility()) {
			enemy.setAbility(new Vampirism(enemy));
			enemy.setAttackMethod(new VampireAttack(enemy));
			enemy.setName("Vampire " + enemy.getName());
			enemy.changeInfectPossibility();
			enemy.changeIsUndead();
		}
		
		enemy.takeDamage(this.dmg);
		this.self.useAbility();
	};
	
	VampireAttack.prototype.counterAttack = function(enemy) {
		this.self.useAbility();
		enemy.takeDamage(this.dmg / 2);
	};


	function Spellbook () {
		this.spellbook = {};
		
		this.spellbook.push(new Heal("Heal", 30, 60));
		this.spellbook.push(new Fireball("Fireball", 40, 50));
	};

	Spellbook.prototype.getSpell = function(spell) {
		return this.spellbook[spell];
	};

	Spellbook.prototype.addSpell = function(spell) {
		this.spellbook.push(spell);
		// spellbook[spell.getName()] = spell;
	};

	Spellbook.prototype.removeSpell = function(spell) {
		var index = spellbook.indexOf(spell);
		
		if (index != -1) {
			spellbook.splice(index, 1);
		}	
	};

	Spellbook.prototype.changeSpell = function(name) {
		for (var i = 0; i < spellbook.length(); i++) {
			if (spellbook[i].getName() == name) {
				spell = spellbook[i];
			};
		}
	};

	function Spell (name, cost, effect) {
		this.name = name;
		this.cost = cost;
		this.effect = effect;
	}

	Spell.prototype.getCost = function() {
		return this.cost;
	};

	Spell.prototype.getEffect = function() {
		return this.effect;
	};

	Spell.prototype.getName = function() {
		return this.name;
	};

	function Heal(name, cost, effect) {
		Spell.apply(name, cost, effect);
	};

	Heal.prototype.action = function(target) {
		target.addHitPoints(effect);
	};

	function Fireball(name, cost, effect) {
		Spell.apply(name, cost, effect);
	};

	Fireball.prototype.action = function(target) {
		target.takeMagicDamage(effect);
	};


	function State(name, hp, dmg) {
	    this.hp = hp;
	    this.maxHp = hp;
	    this.dmg = dmg;
	    this.ability = null;
	};

	State.prototype.getStateCurrentHp = function() { 
	    return this.hp; 
	};

	State.prototype.getStateMaxHp = function() { 
	    return this.maxHp; 
	};

	State.prototype.getStateDamage = function() { 
	    return this.damage; 
	};

	State.prototype.getStateName = function() { 
	    return this.name; 
	};

	State.prototype.newStateName = function(name) { 
	    this.name = newName; 
	};         
	        
	State.prototype.newStateAbility = function(ability) { 
	    this.ability = ability; 
	};

	State.prototype.newStateDamage = function(dmg) {
	    this.dmg = dmg;
	};

	State.prototype.useStateAbility = function() { 
	    if (this.ability != null) {
	        this.ability.action();               
	    }
	};
	    
	State.prototype.removeHp = function(value) {       
	    if (value > this.hp) {
	        this.hp = 0;
	        return;
	    }
	    this.hp -= value;
	};

	State.prototype.addHp = function(value) {
	    var total = this.hp + value;
	    
	    if (total > maxHp) {
	        this.hp = this.maxHp;
	        return;
	    }
	    this.hp = total;
	};

	State.prototype.toString = function() {
	    return this.name + " [HP: " + this.hp + "/" + this.maxHp + " Damage: " + this.dmg + "]";
	};
	
	var map = new Map();
	map.draw();
});
