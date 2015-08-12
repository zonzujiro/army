"use strict"

$(function () {
    function Map() {
        this.map = [];
        this.acted = [];
        this.height = 8;
        this.width = 8;
        this.numberOfUnits = 0;

        for (var i = 0; i < 64; i++) {
            this.map.push(new Location(i));
        }

        this.draw();
    }

    Map.prototype.addUnit = function (unit, index) {
        if (this.map[index].getUnit() != null) {
            throw new LocationAlreadyHaveUnitError("LocationAlreadyHaveUnitException");
        }

        this.map[index].setUnit(unit);
        unit.setMap(this);
        this.numberOfUnits += 1;
    };

    Map.prototype.draw = function () {
        var html = '';

        for (var i = 0; i < this.map.length; i++) {
            html += '<div id="' + i + '" class="cell">' + this.map[i].toString() + '</div>';
        }

        $("#map").html(html);
    };

    // Map.prototype.checkArea = function(x, y, actionPoints) {
    //     var targetX, targetY, directionX, directionY;    
    //     var target;

    //     for (var i = 1; i <= actionPoints; actionPoints--) {    
    //      for (value in directions) {
    //          targetX = x + value.getX() * i;
    //          targetY = y + value.getY() * i;
    //          directionX = x + value.getX();
    //          directionY = y + value.getY();

    //          if (isInside(targetX) && isInside(targetY) && isInside(directionX) && isInside(directionY)) {
    //              if (map[directionX][directionY].getUnit() == null) {
    //                  target = map[directionX][directionY];
    //              }

    //              if (map[targetX][targetY].getUnit() != null && map[directionX][directionY].getUnit() == null) {                  
    //                  return map[directionX][directionY];
    //              }                
    //          }
    //      }
    //  }
    //  return target;    
    // };

    Map.prototype.moveToLocation = function (unit, loc) {
        this.removeUnit(unit);
        this.addUnit(unit, loc.getIndex());
        map.draw();
    };

    Map.prototype.checkArea = function (index, actionPoints) {
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

    Map.prototype.searchAllEnemies = function (self) {
        return this.map.filter(
            function (loc) {
                return loc.getUnit() != null && loc.getUnit() != self;
            }
        );
    };

    Map.prototype.removeUnit = function (unit) {
        this.searchUnit(unit).setUnit(null);
        this.numberOfUnits -= 1;
    };

    Map.prototype.searchUnit = function (unit) {
        for (var i = 0; i < this.map.length; i++) {
            if (this.map[i].getUnit() == unit) {
                return this.map[i];
            }
        }
    };

    Map.prototype.findPathToEnemy = function (start, target) {
        var startX = start.getIndex() % 8;
        var startY = Math.floor(start.getIndex() / 8);
        var targetX = target.getIndex() % 8;
        var targetY = Math.floor(target.getIndex() / 8);
        var targetIndex;

        if (startX < targetX) {
            startX += 1;
        } else if (startX > targetX) {
            startX -= 1;
        }

        if (startY < targetY) {
            startY += 1;
        } else if (startY > targetY) {
            startY -= 1;
        }

        targetIndex = startX + startY * 8;

        return this.map[targetIndex];
    };

    Map.prototype.start = function () {
        for (var i = 0; i < this.map.length; i++) {
            var unit = this.map[i].getUnit();

            if (unit != null && this.acted.indexOf(unit) == -1) {
                unit.act(this.map[i]);
                this.acted.push(unit);
            }
        }

        this.acted = [];

        if (this.numberOfUnits > 1) {
            setTimeout(this.start.bind(this), 666);
        } else {
            this.draw();
        }

    };

    function Location(index) {
        this.index = index;
        this.unit = null;
    };

    Location.prototype.getIndex = function () {
        return this.index;
    };

    Location.prototype.getUnit = function () {
        return this.unit;
    };

    Location.prototype.setUnit = function (unit) {
        this.unit = unit;
    };

    Location.prototype.distance = function (loc) {
        var x = this.index % 8;
        var y = Math.floor(this.index / 8);
        var targetX = loc.getIndex() % 8;
        var targetY = Math.floor(loc.getIndex() / 8);

        return Math.floor(Math.hypot(x - targetX, y - targetY));
    };

    Location.prototype.toString = function () {
        if (this.unit == null) {
            return " ";
        }
        return this.unit.getIcon();
    };

    function Observer() {
        this.handlers = [];
    }

    Observer.prototype.subscribe = function (unit) {
        this.handlers.push(unit);
    };

    Observer.prototype.unsubscribe = function (unit) {
        this.handlers = this.handlers.filter(
            function (item) {
                if (item !== unit) {
                    return item;
                }
            }
        );
    };

    // Observer.prototype.fire = function (o, thisObj) {
    //     var scope = thisObj || window;

    //         this.handlers.forEach(function(item) {
    //             item.call(scope, o);
    //         });
    // };

    Observer.prototype.notify = function () {
        this.handlers.forEach(addHp(getMaxHp() / 4));
    };

    Observer.prototype.sendNotification = function (first_argument) {
        // body...
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
        this.observers = new Observer();
        this.observable = new Observer();
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
        var index = unitLocation.getIndex();
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
        this.state.removeHp(dmg);

        if (!this.ensureIsAlive()) {
            this.map.removeUnit(this);
        }
    };

    Unit.prototype.takeMagicDamage = function (dmg) {
        if (this.ensureIsAlive()) {
            this.takeDamage(dmg);
        }
    };

    Unit.prototype.useAbility = function () {
        if (this.ensureIsAlive()) {
            this.ability.action();
        }
    };

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
        this.icon = "R";
    };

    Rogue.prototype = Object.create(Unit.prototype);

    Rogue.prototype.attack = function (enemy) {
        enemy.takeDamage(this.getDamage());
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

    Spellcaster.prototype.method_name = function () {
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

    Necromancer.prototype.takeDamage = function (dmg) {
        if (ensureIsAlive()) {
            state.removeHp();

            if (!ensureIsAlive()) {

            }
        };
    };

    Necromancer.prototype.useSpell = function (target) {
        var cost = this.spell.getCost();
        var distance = this.getLocation().distance(target.getLocation());

        this.mana -= cost;
        this.spell.action(target);
        target.addObserver(this);
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

    function Vampirism(target) {
        this.target = target;
    };

    Vampirism.prototype.action = function () {
        this.target.addHitPoints(parseInt(this.target.getDamage() / 4, 10));
    };

    function Transformation(target) {
        this.target = target;
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
        // spellbook[spell.getName()] = spell;
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

    State.prototype.newAbility = function (ability) {
        this.ability = ability;
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
    var w = new Werewolf("Werewolf", 115, 15);
    var v = new Vampire("Vampire", 200, 25);

    var wz = new Wizard("Wizard", 150, 10, 200);
    var wk = new Warlock("Warlock", 170, 15, 150);
    var p = new Priest("Priest", 160, 15, 300);
    var h = new Healer("Healer", 130, 10, 300);

    map.addUnit(s, 0);
    map.addUnit(r, 7);
    // map.addUnit(b, 6);
    // map.addUnit(w, 8);
    // map.addUnit(v, 9);
    map.addUnit(wz, 63);
    // map.addUnit(wk, 11);
    map.addUnit(p, 49);
    // map.addUnit(h, 13);

    console.log(s.toString());
    console.log(r.toString());

    map.draw();
    map.start();
    map.draw();

    console.log(s.toString());
    console.log(r.toString());

});
