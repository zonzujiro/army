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
        
        for (var y = 7; y >= 0; y--) {
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
        var html = '';
        
        for (var i = 0; i < this.map.length; i++) {
            html += '<div id="x:' + this.map[i].x + ' y:'+  this.map[i].y +' index:' + i +'" class="cell">' + this.map[i].toString() + '</div>';
        }

        $("#map").html(html);
    };

    Map.prototype.checkArea = function(loc) {
        var x, y, index, checked = [];
        
        function isInside(num) {
            return num > 0 && num < 8;
        }
        
        for (var value in this.directions) {
            x = loc.x + this.directions[value].x;
            y = loc.y + this.directions[value].y;
            console.log("x " + x + " y " + y);
            
            if (isInside(x) && isInside(y)) {
                index = x + y * 8;
                index = index.x + index.y * 8;
                console.log("index: " + index);
                
                if (this.map[index].unit == null) {
                    checked.push(this.map[index]);                    
                }
            }
        }
        console.log(checked);
        return checked;
    };

    Map.prototype.moveToLocation = function (unit, loc) {
        var index = loc.x + loc.y * 8;
        console.log(index);
        
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
        this.searchUnit(unit).setUnit(null);
    };

    Map.prototype.searchUnit = function (unit) {
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
        console.log(index);

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
    
    Location.prototype.plus = function(loc) {
        return new Location(this.x + loc.x, this.y + loc.y);
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
        if (!enemy.isImmune()) {
            enemy.setWolfState(new State(enemy.getName() + " as Wolf", enemy.getMaxHp() * 2, enemy.getDamage() * 2));
            enemy.setName(enemy.getName() + " as Human");
            enemy.setAbility(new Transformation(enemy));
            enemy.setAttackMethod(new WerewolfAttack(enemy.getDamage()));
            enemy.changeImmunity();
        }

        enemy.takeDamage(this.dmg);
    };

    WerewolfAttack.prototype.counterattack = function (enemy) {
        enemy.takeDamage(this.dmg / 2);
    };

    function VampireAttack(self) {
        this.self = self;
        this.dmg = self.getDamage();
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
        return this.map.searchUnit(this);
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
        console.log(this.getName() + " turn");

        var enemies = this.map.searchAllEnemies(this);
        var target = this.chooseNearestEnemy(enemies, unitLocation);

        if (unitLocation.distance(target) <= this.getAttackDistance()) {
            console.log(this.getName() + " attacking " + target.unit.state.name);
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
        console.log(this.getName() + " attacking " + enemy.getName());

        this.attackMethod.attack(enemy);
        enemy.counterattack(this);
    };

    Unit.prototype.counterattack = function (enemy) {
        if (!this.ensureIsAlive()) {
            return;
        }

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
        return this.map.searchUnit(this.master);
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
        enemy.takeDamage(this.getDamage());
    };
    
    Rogue.prototype.useAbility = function() {
        this.ability.action(this.map);
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

        this.mana = this.maxMana = mana;
        this.spellbook = new Spellbook();
        this.attackMethod = new DefaultAttack(dmg);
    }

    Spellcaster.prototype = Object.create(Unit.prototype);

    Spellcaster.prototype.getMana = function () {
        return this.mana;
    };

    Spellcaster.prototype.getMaxMana = function () {
        return this.maxMana;
    };

    Spellcaster.prototype.addMana = function (value) {
        ensureIsAlive();

        var mp = mana + value;

        if (mp > this.maxMana) {
            this.mana = this.maxMana;
            return;
        }
        this.mana = mp;
    };

    Spellcaster.prototype.getAttackDistance = function () {
        if (this.spell.getCost() >= this.mana) {
            return this.spell.getRange();
        }
        return this.attackMethod.getDistance();
    };


    Spellcaster.prototype.useSpell = function (target) {
        this.mana -= this.spell.getCost();
        this.spell.action(target);
    }

    Spellcaster.prototype.changeSpell = function (spell) {
        ensureIsAlive();

        spell = this.spellbook.getSpell(spell);
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
        var cost = this.spell.getCost();
        var distance = this.getLocation().distance(target.getLocation());

        this.mana -= cost;
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
            if (this.slave != null && Math.random() > 0.3) {
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
        var cost = this.spell.getCost();
        var distance = getLocation().distance(target.getLocation());

        if (distance > spell.getRange()) {
            console.log(this.getName() + " tried to use his spell on " + target.getName() + " but he too far");
            return;
        }

        this.mana -= cost;

        if (this.spell.getName() == "Heal" && target.isUndead()) {
            target.takeMagicDamage(this.spell.getDamage() * 2);
            return;
        }

        this.spell.action(target);
        console.log(this.getName() + " uses " + this.spell.getSpellName() + " on " + target.getName())
    };
    
    function Ability (target) {
        this.target = target;
    }
    
    function Evading (target, map) {
        Ability.apply(this, arguments);
    }
    
    Evading.prototype.action = function(map) {
        var loc = this.target.getLocation();
        
        map.checkArea(loc);
    };

    function Vampirism(target) {
        Ability.apply(this, arguments);
    };

    Vampirism.prototype.action = function () {
        this.target.addHitPoints(parseInt(this.target.getDamage() / 4, 10));
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
    var n = new Necromancer("Necromancer", 300, 20, 200);

    // map.addUnit(s, 0);
    map.addUnit(r, 7);
    r.useAbility();
    // map.addUnit(b, 6);
    // map.addUnit(w, 8);
    // map.addUnit(v, 9);
    // map.addUnit(wz, 63);
    // map.addUnit(wk, 11);
    // map.addUnit(p, 49);
    // map.addUnit(h, 13);
    map.addUnit(n, 63);

    // console.log(s.toString());
    // console.log(n.toString());

    // map.draw();
    // map.start();
    // map.draw();

    // console.log(s.toString());
    // console.log(r.toString());

});
