"use strict"

$(function () {
    function Map() {
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
                this.map.push(new Location (x, y));
            }
        }
        
        this.draw();
    }

    Map.prototype.addUnit = function (unit, index) {
        if (this.map[index].getUnit() != null) {
            throw new LocationAlreadyHaveUnitError("LocationAlreadyHaveUnitException");
        }

        this.map[index].setUnit(unit);
        unit.setMap(this);
    };

    Map.prototype.draw = function () {
        var total = 8;
        var index = this.map.length - total;
        var width = 8, height = 8;
        var html = '';
                        
        for (var k = 0; k < width; k++) {
            for (var z = 0; z < height; z++, index++, total++) {
                html += '<div id="x:' + this.map[index].x + ' y:'+  this.map[index].y +' index:' + index +'" class="cell">' + this.map[index].toString() + '</div>';
            }
            index = this.map.length - total;
        }

        $("#map").html(html);
    };

    Map.prototype.checkAreaAround = function(loc) {
        var x, y, index, checked = [];
        
        function isInside(num) {
            return num >= 0 && num < 8;
        }
        
        for (var value in this.directions) {
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
    };

    Map.prototype.moveToLocation = function (unit, loc) {
        var index = loc.x + loc.y * 8;
        
        this.removeUnit(unit);
        this.addUnit(unit, index);
    };

    Map.prototype.calculateUnits = function () {
        var counter = 0;

        for (var i = 0; i < this.map.length; i++) {
            if (this.map[i].getUnit() != null) {
                counter += 1;
            }
        }
        return counter;
    };

    Map.prototype.searchAllEnemies = function (self) {
        return this.map.filter(function (loc) {
            return loc.getUnit() != null && loc.getUnit() != self;
        });
    };

    Map.prototype.removeUnit = function (unit) {
        this.searchUnitLocation(unit).setUnit(null);
    };

    Map.prototype.searchUnitLocation = function (unit) {
        for (var i = 0; i < this.map.length; i++) {
            if (this.map[i].getUnit() == unit) {
                return this.map[i];
            }
        }
    };
    
    Map.prototype.findPathToEnemy = function (current, target) {
        var currentX = current.getX(), currentY = current.getY();
        var targetX = target.getX(), targetY = target.getY();
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
    };

    Map.prototype.start = function () {
        for (var i = 0; i < this.map.length; i++) {
            var unit = this.map[i].getUnit();

            if (this.calculateUnits() > 1 && unit != null && this.acted.indexOf(unit) == -1) {
                unit.act(this.map[i]);
                this.acted.push(unit);
                this.draw();
            }
        }

        this.acted = [];

        if (this.calculateUnits() > 1) {
            setTimeout(this.start.bind(this), 666);
            console.log("--------------------------------");
        } else {
            this.draw();
        }
    };

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

    function AttackMethod(dmg) {
        this.dmg = dmg;
        this.distance = 1;
    };

    AttackMethod.prototype.getDistance = function () {
        return this.distance;
    };

    function DefaultAttack(dmg) {
        AttackMethod.apply(this, arguments);
    };

    DefaultAttack.prototype = Object.create(AttackMethod.prototype);

    DefaultAttack.prototype.attack = function (enemy) {
        enemy.takeDamage(this.dmg);
    };

    DefaultAttack.prototype.counterattack = function (enemy) {
        enemy.takeDamage(this.dmg / 2);
    };

    function RangeAttack(dmg) {
        AttackMethod.apply(this, arguments);
        this.distance = 3;
    }

    RangeAttack.prototype = Object.create(DefaultAttack.prototype);

    function WerewolfAttack(dmg) {
        AttackMethod.apply(this, arguments);
    }

    WerewolfAttack.prototype = Object.create(AttackMethod.prototype);

    WerewolfAttack.prototype.attack = function (enemy) {
        enemy.takeDamage(this.dmg);
        
        if (!enemy.isImmune()) {
            enemy.setWolfState(new State(enemy.getName() + " as Wolf", enemy.getMaxHp() * 2, enemy.getDamage() * 2));
            enemy.setName(enemy.getName() + " as Human");
            enemy.setAbility(new Transformation(enemy));
            enemy.setAttackMethod(new WerewolfAttack(enemy.getDamage()));
            enemy.changeImmunity();
        }
    };

    WerewolfAttack.prototype.counterattack = function (enemy) {
        enemy.takeDamage(this.dmg / 2);
    };

    function VampireAttack(self) {        
        this.self = self;
        this.dmg = self.getDamage();
        this.distance = 1;
    };

    VampireAttack.prototype = Object.create(AttackMethod.prototype);

    VampireAttack.prototype.attack = function (enemy) {
        if (!enemy.isImmune()) {
            enemy.setAbility(new Vampirism(enemy));
            enemy.setAttackMethod(new VampireAttack(enemy));
            enemy.setName("Vampire " + enemy.getName());
            enemy.changeImmunity();
            enemy.changeIsUndead();
        }

        enemy.takeDamage(this.dmg);
        this.self.useAbility();
    };

    VampireAttack.prototype.counterattack = function (enemy) {
        this.self.useAbility();
        enemy.takeDamage(this.dmg / 2);
    };

    function Unit(name, hp, dmg) {
        this.state = new State(name, hp, dmg);
        this.ability = null;
        this.actionPoints = 4;
        this.wolfState = null;

        this.immunity = false;
        this.wolf = false;
        this.undead = false;

        this.icon;
        this.map;
        this.enemy;
        this.checkedMoves = [];
        this.observers = [];
    };

    Unit.prototype.ensureIsAlive = function () {
        if (this.getCurrentHp() == 0) {
            return false;
        }
        return true;
    };

    Unit.prototype.getDamage = function () {
        return this.state.getDamage();
    };

    Unit.prototype.getCurrentHp = function () {
        return this.state.getCurrentHp();
    };

    Unit.prototype.getMaxHp = function () {
        return this.state.getMaxHp();
    };

    Unit.prototype.getName = function () {
        return this.state.getName();
    };

    Unit.prototype.getState = function () {
        return this.state;
    };

    Unit.prototype.getWolfState = function () {
        return this.wolfState;
    };

    Unit.prototype.isImmune = function () {
        return this.immunity;
    };

    Unit.prototype.getIsWolf = function () {
        return this.isWolf;
    };

    Unit.prototype.getIsUndead = function () {
        return this.isUndead;
    };

    Unit.prototype.getIcon = function () {
        return this.icon;
    };

    Unit.prototype.getLocation = function () {
        return this.map.searchUnitLocation(this);
    };

    Unit.prototype.getActionPoints = function () {
        return this.actionPoints;
    };

    Unit.prototype.getAttackDistance = function () {
        return this.attackMethod.getDistance();
    };

    Unit.prototype.changeImmunity = function () {
        this.immunity = !this.immunity;
    };

    Unit.prototype.changeIsWolf = function () {
        this.wolf = !this.wolf;
    };

    Unit.prototype.changeIsUndead = function () {
        this.undead = !this.undead;
    };

    Unit.prototype.setAbility = function (newAbility) {
        this.ability = newAbility;
    };

    Unit.prototype.setAttackMethod = function (newMethod) {
        this.attackMethod = newMethod;
    };
    
    Unit.prototype.setEnemy = function setName(enemy) {
        this.enemy = enemy;
    };

    Unit.prototype.setName = function setName(newName) {
        this.state.newName(newName);
    };

    Unit.prototype.setState = function (newState) {
        this.state = newState;
    };

    Unit.prototype.setWolfState = function (newState) {
        this.wolfState = newState;
    };

    Unit.prototype.setIcon = function (icon) {
        this.icon = icon;
    };

    Unit.prototype.setMap = function (map) {
        this.map = map;
    };

    Unit.prototype.addMove = function (value) {
        this.checkedMoves.push(value);
    };

    Unit.prototype.act = function (unitLocation) {
        console.log("[" + this + "] turn");

        var enemies = this.map.searchAllEnemies(this);
        var target = this.chooseNearestEnemy(enemies, unitLocation);

        if (unitLocation.distance(target) <= this.getAttackDistance()) {
            this.attack(target.getUnit());
            return;
        }

        this.move(this.map.findPathToEnemy(unitLocation, target));
    };

    Unit.prototype.move = function (loc) {
        this.map.moveToLocation(this, loc);
    };

    Unit.prototype.addHitPoints = function (hp) {
        if (this.ensureIsAlive()) {
            this.state.addHp(hp);
        }
    };

    Unit.prototype.attack = function (enemy) { 
        console.log(this.state.name + " attacking " + enemy.state.name + " [Damage: " + this.getDamage() + "]");
           
        enemy.setEnemy(this);
        this.attackMethod.attack(enemy);
        enemy.counterattack(this);
    };

    Unit.prototype.counterattack = function (enemy) {
        if (!this.ensureIsAlive()) {
            return;
        }
        console.log(this.state.name + " counterattacking " + enemy.state.name + " [dmg: " + this.getDamage() / 2 + "]");
        enemy.setEnemy(this);
        this.attackMethod.counterattack(enemy);
    };

    Unit.prototype.chooseNearestEnemy = function (enemies, loc) {
        return enemies.reduce(
            function (prev, current) {
                return loc.distance(current) > loc.distance(prev) ? prev : current;
            }
        );
    };

    Unit.prototype.takeDamage = function (dmg) {
        if (this.ensureIsAlive()) {
            this.state.removeHp(dmg);

            if (!this.ensureIsAlive()) {
                this.map.removeUnit(this);
                this.notify();
            }
        }
    };

    Unit.prototype.takeMagicDamage = function (dmg) {
        this.takeDamage(dmg);
    };

    Unit.prototype.useAbility = function () {
        if (this.ensureIsAlive()) {
            this.ability.action();
        }
    };

    Unit.prototype.notify = function () {
        var self = this;

        this.observers.forEach(function (observer) {
            observer.addHitPoints(parseInt(self.getMaxHp() / 3));
        });
    };

    Unit.prototype.addObserver = function (observer) {
        if (this.observers.indexOf(observer) == -1) {
            this.observers.push(observer);
        }
    }

    Unit.prototype.toString = function () {
        return this.state.toString();
    };

    function Soldier(name, hp, dmg) {
        Unit.apply(this, arguments);
        this.attackMethod = new DefaultAttack(dmg);
        this.icon = "S";
    };

    Soldier.prototype = Object.create(Unit.prototype);

    function Demon(name, hp, dmg, master, map) {
        Soldier.apply(this, arguments);
        this.master = master;
        this.map = map;
        this.immunity = true;
        this.master.setSlave(this);
    }

    Demon.prototype = Object.create(Soldier.prototype);

    Demon.prototype.getLocation = function () {
        return this.map.searchUnitLocation(this.master);
    };

    Demon.prototype.takeDamage = function (dmg) {
        this.state.removeHp(dmg);

        if (!this.ensureIsAlive()) {
            this.master.freeSlave();
        }
    };

    function Berserker(name, hp, dmg) {
        Unit.apply(this, arguments);
        this.attackMethod = new DefaultAttack(dmg);
        this.icon = "B";
    };

    Berserker.prototype = Object.create(Unit.prototype);

    Berserker.prototype.takeMagicDamage = function (dmg) {
        return "Berserker invulnerable to magic";
    };

    Berserker.prototype.addHitPoints = function (hp) {
        return "Berserker invulnerable to magic";
    };

    function Rogue(name, hp, dmg) {
        Unit.apply(this, arguments);
        this.attackMethod = new DefaultAttack(dmg);
        this.ability = new Evading(this, this.map);
        this.icon = "R";
    };

    Rogue.prototype = Object.create(Unit.prototype);

    Rogue.prototype.attack = function (enemy) {
        enemy.setEnemy(this);
        enemy.takeDamage(this.getDamage());
    };
    
    Rogue.prototype.takeDamage = function(dmg) {
        if (this.ability instanceof Evading && Math.random() > 0.3) {
            if (this.ability.action(this.map, this.enemy)) {
                console.log(this.state.name + " evading attack with no harm");
                return;
            };
        }
        
        this.state.removeHp(dmg);
        
        if (!this.ensureIsAlive()) {
            this.map.removeUnit(this);
            this.notify();
        }
    };

    function Vampire(name, hp, dmg) {
        Unit.apply(this, arguments);
        this.attackMethod = new VampireAttack(this);        
        this.setAbility(new Vampirism(this));
        this.immunity = true;
        this.undead = true;
        this.icon = "V";
    };

    Vampire.prototype = Object.create(Unit.prototype);

    function Werewolf(name, hp, dmg) {
        Unit.apply(this, arguments);
        this.attackMethod = new WerewolfAttack(dmg);
        this.state = new State(name + " as Human", hp, dmg);
        this.wolfState = new State(name + " as Wolf", hp * 2, dmg * 2);
        this.setAbility(new Transformation(this));
        this.icon = "W";
    };

    Werewolf.prototype = Object.create(Unit.prototype);

    Werewolf.prototype.takeMagicDamage = function (dmg) {
        if (this.wolf) {
            this.takeDamage(dmg * 2);
        } else {
            this.takeDamage(dmg);
        }
    };

    function Spellcaster(name, hp, dmg, mana) {
        Unit.apply(this, arguments);

        this.spell;
        this.mana = this.maxMana = mana;
        this.spellbook = new Spellbook();
        this.attackMethod = new RangeAttack(dmg);
    }

    Spellcaster.prototype = Object.create(Unit.prototype);
    
    Spellcaster.prototype.act = function (unitLocation) {
        console.log("[" + this + "] turn");

        var enemies = this.map.searchAllEnemies(this);
        var target = this.chooseNearestEnemy(enemies, unitLocation);
        
        if (this.mana < this.maxMana) {
            this.addMana(10);
        }
        
        if (this.state.hp < this.state.maxHp && this.mana >= this.spellbook.getSpell("Heal").cost) {
            if (this.spell.name != "Heal") {
                var oldSpell = this.spell.name;
                
                this.changeSpell("Heal");
                this.useSpell(this);
                this.spell = this.spellbook.getSpell(oldSpell);
            } else {
                this.useSpell(this);
            }
        }

        if (unitLocation.distance(target) <= this.getAttackDistance()) {
            this.attack(target.getUnit());
            return;
        }

        this.move(this.map.findPathToEnemy(unitLocation, target));
    };
    
    Spellcaster.prototype.attack = function(enemy) {
        enemy.setEnemy(this);
        
        if (!this.wolf && this.mana >= this.spell.cost) {
            this.useSpell(enemy);
            return;
        }
        
        this.attackMethod.attack(enemy);
        enemy.counterattack(this);
    };
    
    Spellcaster.prototype.counterattack = function(enemy) {
        if (this.ensureIsAlive()) {
            enemy.setEnemy(this);
            
            if (!this.wolf && this.mana >= this.spell.cost) {
                this.useSpell(enemy);
                return;
            }
            
            this.attackMethod.counterattack(enemy);
        }
    };

    Spellcaster.prototype.getMana = function () {
        return this.mana;
    };

    Spellcaster.prototype.getMaxMana = function () {
        return this.maxMana;
    };

    Spellcaster.prototype.addMana = function (value) {
        var mp = this.mana + value;

        if (mp > this.maxMana) {
            this.mana = this.maxMana;
            return;
        }
        this.mana = mp;
    };

    Spellcaster.prototype.getAttackDistance = function () {
        if (this.spell.cost >= this.mana) {
            return this.spell.getRange();
        }
        return this.attackMethod.getDistance();
    };

    Spellcaster.prototype.useSpell = function (target) {
        console.log(this.state.name + " using " + this.spell.name + " [Dmg: " + this.spell.effect + "] on a " + target.state.name);
        
        ensureIsAlive();
        this.mana -= this.spell.cost;
        this.spell.action(target);
    }

    Spellcaster.prototype.changeSpell = function (name) {
        spell = this.spellbook.getSpell(name);
    };

    Spellcaster.prototype.toString = function () {
        return this.state.toString() + " Mana: " + this.mana + "/" + this.maxMana;
    }

    function Battlemage(name, hp, dmg, mana) {
        Spellcaster.apply(this, arguments);
    }

    Battlemage.prototype = Object.create(Spellcaster.prototype);

    Battlemage.prototype.changeSpell = function (name) {
        this.spell = this.spellbook.getSpell(name);

        if (name == "Heal") {
            this.spell.setEffect(this.spell.getEffect() / 2);
        }
    };

    function Wizard(name, hp, dmg, mana) {
        Battlemage.apply(this, arguments);
        this.spell = this.spellbook.getSpell("Fireball");
        this.icon = "Wz";
    };

    Wizard.prototype = Object.create(Battlemage.prototype);

    function Necromancer(name, hp, dmg, mana) {
        Battlemage.apply(this, arguments);
        this.attackMethod = new RangeAttack(dmg);
        this.spell = this.spellbook.getSpell("Fireball");
        this.icon = "N";
    };

    Necromancer.prototype = Object.create(Battlemage.prototype);

    Necromancer.prototype.useSpell = function (target) {
        console.log(this.state.name + " using " + this.spell.name + " [Dmg: " + this.spell.effect + "] on a " + target.state.name);     
        
        target.setEnemy(this);
        this.mana -= this.spell.cost;
        target.addObserver(this);
        this.spell.action(target);
    };

    function Warlock(name, hp, dmg, mana) {
        Battlemage.apply(this, arguments);
        this.spell = this.spellbook.getSpell("Fireball");
        this.icon = "Wk";
        this.slave = null;
    };

    Warlock.prototype = Object.create(Battlemage.prototype);

    Warlock.prototype.attack = function (enemy) {
        var distance = this.getLocation().distance(enemy.getLocation());
        enemy.setEnemy(this);

        if (distance == 1 && this.slave != null) {
            slaveAttack(enemy);
            return;
        }

        if (!this.wolf && this.mana >= this.spell.getCost()) {
            this.useSpell(enemy);
            return;
        }

        this.attackMethod.attack(enemy);
        enemy.counterattack(this);
    };

    Warlock.prototype.counterattack = function (enemy) {
        if (!this.ensureIsAlive()) {
            return;
        }

        var distance = this.getLocation().distance(enemy.getLocation());

        if (distance > this.attackMethod.getDistance()) {
            console.log(this.getName() + " tried to counterattack " + enemy.getName() + " but he too far");
            return;
        }
        
        if (!this.wolf && this.mana >= this.spell.getCost()) {
            this.useSpell(enemy);
            return;
        }
        
        enemy.setEnemy(this);
        this.attackMethod.counterattack(enemy);
    };

    Warlock.prototype.demon = function () {
        return this.slave;
    };

    Warlock.prototype.freeSlave = function () {
        console.log(getName() + " set his " + slave.getName() + " free");

        this.slave = null;
    };

    Warlock.prototype.setSlave = function (demon) {
        this.slave = demon;
    };

    Warlock.prototype.summon = function () {
        if (this.slave != null) {
            freeSlave();
        }

        this.slave = new Demon("Demon", 250, 50, this, this.map);
        this.mana -= 50;
        console.log(this.getName() + " summons his pet: " + this.slave.getName());
    };

    Warlock.prototype.slaveAttack = function (enemy) {
        this.slave.attack(enemy);
    };

    Warlock.prototype.takeDamage = function (dmg) {
        if (this.ensureIsAlive()) {
            if (this.slave != null && Math.random() > 0.5) {
                this.slave.takeDamage(dmg);
                console.log(this.slave.getName() + " covers his master and takes damage");
                return;
            }

            this.state.removeHp(dmg);
        }
    };

    Warlock.prototype.toString = function () {
        var out = this.getName() + " | HP: " + this.getCurrentHp() + "/" + this.getMaxHp() + " MP: " + this.mana + "/" + this.maxMana + " Damage: " + this.getDamage();

        if (this.slave != null) {
            out += " with " + this.slave.toString();
        }

        return out;
    };

    Warlock.prototype.takeMagicDamage = function (dmg) {
        takeDamage(dmg);
    };

    function Supportmage(name, hp, dmg, mana) {
        Spellcaster.apply(this, arguments);
    }

    Supportmage.prototype = Object.create(Spellcaster.prototype);

    Spellcaster.prototype.changeSpell = function (name) {
        this.spell = spellbook.getSpell(name);

        if (name == "Fireball") {
            this.spell.setEffect(this.spell.getEffect() / 2);
        }
    };

    function Healer(name, hp, dmg, mana) {
        Supportmage.apply(this, arguments);
        this.spell = this.spellbook.getSpell("Heal");
        this.icon = "H";
    }

    Healer.prototype = Object.create(Supportmage.prototype);

    function Priest(name, hp, dmg, mana) {
        Supportmage.apply(this, arguments);
        this.spell = this.spellbook.getSpell("Heal");
        this.icon = "P";
    }

    Priest.prototype = Object.create(Supportmage.prototype);

    Priest.prototype.useSpell = function (target) {
        console.log(this.state.name + " using " + this.spell.name + " [Dmg: " + this.spell.effect + "] on a " + target.state.name);
        
        this.mana -= this.spell.cost;

        if (this.spell.name == "Heal" && target.undead) {
            target.takeMagicDamage(this.spell.effect * 2);
            return;
        }
        
        target.enemy = this;
        this.spell.action(target);        
    };
    
    function Ability (target) {
        this.target = target;
    }
    
    function Evading (target, map) {
        Ability.apply(this, arguments);
    }
    
    Evading.prototype.action = function(map, enemy) {
        var currentLocation = this.target.getLocation();
        var area = map.checkAreaAround(currentLocation);
        var attackDistance = this.target.getAttackDistance();        
        var possibleMoves = area.filter(function(emptyCell) {
            return emptyCell.distance(enemy.getLocation()) <= attackDistance;
        });
        
        if (possibleMoves.length > 0) {
            this.target.move(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
            return true;
        }
        return false;
    };

    function Vampirism(target) {
        Ability.apply(this, arguments);
    };

    Vampirism.prototype.action = function () {
        var drainedHp = parseInt(this.target.getDamage() / 3, 10);
        
        console.log(this.target.state.name + " drained " + drainedHp + "hp");                
        this.target.addHitPoints(drainedHp);
    };

    function Transformation(target) {
        Ability.apply(this, arguments);
    };

    Transformation.prototype.action = function () {
        var tmp = this.target.getState();
        var hpDifference = this.target.getMaxHp() - this.target.getCurrentHp();

        this.target.setState(this.target.getWolfState());
        this.target.setWolfState(tmp);
        this.target.changeIsWolf();
        this.target.takeDamage(hpDifference);
    };

    function Spellbook() {
        this.spellbook = [];

        this.spellbook.push(new Heal("Heal", 30, 60));
        this.spellbook.push(new Fireball("Fireball", 40, 50));
    };

    Spellbook.prototype.getSpell = function (name) {
        for (var i = 0; i < this.spellbook.length; i++) {
            if (this.spellbook[i].getName() == name) {
                return this.spellbook[i];
            };
        }
    };

    Spellbook.prototype.addSpell = function (spell) {
        this.spellbook.push(spell);
    };

    Spellbook.prototype.removeSpell = function (spell) {
        var index = spellbook.indexOf(spell);

        if (index != -1) {
            spellbook.splice(index, 1);
        }
    };

    Spellbook.prototype.changeSpell = function (name) {
        for (var i = 0; i < spellbook.length(); i++) {
            if (spellbook[i].getName() == name) {
                spell = spellbook[i];
            };
        }
    };

    function Spell(name, cost, effect) {
        this.name = name;
        this.cost = cost;
        this.effect = effect;
        this.useDistance = 3;
    }

    Spell.prototype.getCost = function () {
        return this.cost;
    };

    Spell.prototype.getEffect = function () {
        return this.effect;
    };

    Spell.prototype.setEffect = function (value) {
        this.effect = value;
    };

    Spell.prototype.getName = function () {
        return this.name;
    };
    
    Spell.prototype.getRange = function() {
        return this.useDistance;
    };

    function Heal(name, cost, effect) {
        Spell.apply(this, arguments);
    };

    Heal.prototype = Object.create(Spell.prototype);

    Heal.prototype.action = function (target) {
        target.addHitPoints(this.effect);
    };

    function Fireball(name, cost, effect) {
        Spell.apply(this, arguments);
    };

    Fireball.prototype = Object.create(Spell.prototype);

    Fireball.prototype.action = function (target) {
        target.takeMagicDamage(this.effect);
    };

    function State(name, hp, dmg) {
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.dmg = dmg;
    };

    State.prototype.getCurrentHp = function () {
        return this.hp;
    };

    State.prototype.getMaxHp = function () {
        return this.maxHp;
    };

    State.prototype.getDamage = function () {
        return this.dmg;
    };

    State.prototype.getName = function () {
        return this.name;
    };

    State.prototype.newName = function (name) {
        this.name = name;
    };

    State.prototype.newDamage = function (dmg) {
        this.dmg = dmg;
    };

    State.prototype.removeHp = function (value) {
        if (value > this.hp) {
            this.hp = 0;
            return;
        }
        this.hp -= value;
    };

    State.prototype.addHp = function (value) {
        var total = this.hp + value;

        if (total > this.maxHp) {
            this.hp = this.maxHp;
            return;
        }

        this.hp = total;
    };

    State.prototype.toString = function () {
        return this.name + " | HP: " + this.hp + "/" + this.maxHp + " Damage: " + this.dmg;
    };

    var map = new Map();
    var s = new Soldier("Soldier", 200, 20);
    var b = new Berserker("Berserker", 200, 20);
    var r = new Rogue("Rogue", 175, 30);
    var w = new Werewolf("Werewolf", 150, 15);
    var v = new Vampire("Vampire", 200, 25);

    var wz = new Wizard("Wizard", 150, 10, 200);
    var wk = new Warlock("Warlock", 170, 15, 150);
    var p = new Priest("Priest", 160, 15, 300);
    var h = new Healer("Healer", 130, 10, 300);
    var n = new Necromancer("Necromancer", 200, 20, 200);

    map.addUnit(s, 37);
    map.addUnit(r, 6);
    // r.useAbility(s);
    // map.addUnit(b, 6);
    // map.addUnit(w, 8);
    map.addUnit(v, 11);
    // map.addUnit(wz, 63);
    // map.addUnit(wk, 11);
    // map.addUnit(p, 49);
    // map.addUnit(h, 13);
    map.addUnit(n, 63);

    // console.log(s.toString());
    // console.log(n.toString());

    map.draw();
    map.start();
    // map.draw();

    // console.log(s.toString());
    // console.log(r.toString());

});
