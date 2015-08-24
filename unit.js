function Unit(name, hp, dmg) {
    this.state = new State(name, hp, dmg);
    this.wolfState = null;
    this.ability = null;
    this.actionPoints = 4;

    this.immunity = false;
    this.wolf = false;
    this.undead = false;

    this.icon;
    this.map;
    this.enemy;
    this.userInterface;
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

Unit.prototype.getIcon = function () {
    return this.icon;
};

Unit.prototype.getLocation = function () {
    return this.map.searchUnitLocation(this);
};

Unit.prototype.getAttackDistance = function () {
    return this.attackMethod.getDistance();
};

Unit.prototype.getAttackMethod = function () {
    return this.attackMethod;
};

Unit.prototype.changeIsWolf = function () {
    this.wolf = !this.wolf;
};

Unit.prototype.setName = function setName(newName) {
    this.state.newName(newName);
};

Unit.prototype.setIcon = function (icon) {
    this.icon = icon;
};

Unit.prototype.setMap = function (map) {
    this.map = map;
};

Unit.prototype.act = function (unitLocation) {
    console.log(this.userInterface);
    this.userInterface.print("[" + this + "] turn");

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
    // console.log(this.state.name + " attacking " + enemy.state.name + " [Damage: " + this.getDamage() + "]");
    this.userInterface.print(this.state.name + " attacking " + enemy.state.name + " [Damage: " + this.getDamage() + "]");

    enemy.enemy = this;
    this.attackMethod.attack(enemy);
    enemy.counterattack(this);
};

Unit.prototype.counterattack = function (enemy) {
    if (!this.ensureIsAlive()) {
        return;
    }
    this.userInterface.print(this.state.name + " counterattacking " + enemy.state.name + " [dmg: " + this.getDamage() / 2 + "]");
    // console.log(this.state.name + " counterattacking " + enemy.state.name + " [dmg: " + this.getDamage() / 2 + "]");
    enemy.enemy = this;
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
            this.userInterface.print(this.state.name + " died because of war");
            // console.log(this.state.name + " died because of war");
            this.map.removeUnit(this);
            this.notify();
        }
    }
};

Unit.prototype.takeMagicDamage = function (dmg) {
    this.takeDamage(dmg);
};

Unit.prototype.notify = function () {
    var self = this;

    if (this.observers.length > 0) {
        this.userInterface.print(this.state.name + " gives " + parseInt(this.state.maxHp / 3, 10) + "hp to his observers");
        // console.log("After death " + this.state.name + " gives " + parseInt(this.state.maxHp / 3, 10) + "hp to his observers");
        this.observers.forEach(function (observer) {
            observer.addHitPoints(self.getMaxHp() / 3);
        });
    }
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
    this.ability = new HideBehindShield(this);
    this.icon = "S";
};

Soldier.prototype = Object.create(Unit.prototype);

Soldier.prototype.takeDamage = function (dmg) {
    if (this.ability.action(dmg)) {
        return;
    }

    this.state.removeHp(dmg);

    if (!this.ensureIsAlive()) {
        // console.log(this.state.name + " died because of war");
        this.userInterface.print(this.state.name + " died because of war");
        this.map.removeUnit(this);
        this.notify();
    }
}

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
        // console.log(this.state.name + " died because of war");
        this.userInterface.print(this.state.name + " died because of war");
        this.master.freeSlave();
        this.notify();
    }
};

function Berserker(name, hp, dmg) {
    Unit.apply(this, arguments);
    this.attackMethod = new DefaultAttack(dmg);
    this.icon = "B";
};

Berserker.prototype = Object.create(Unit.prototype);

Berserker.prototype.takeMagicDamage = function (dmg) {
    // return "Berserker invulnerable to magic";
    this.userInterface.print("Berserker invulnerable to magic");
};

function Rogue(name, hp, dmg) {
    Unit.apply(this, arguments);
    this.attackMethod = new DefaultAttack(dmg);
    this.ability = new Evading(this, this.map);
    this.icon = "R";
};

Rogue.prototype = Object.create(Unit.prototype);

Rogue.prototype.attack = function (enemy) {
    enemy.enemy = this;
    enemy.takeDamage(this.getDamage());
};

Rogue.prototype.takeDamage = function (dmg) {
    if (Math.random() > 0.3) {
        if (this.ability.action(this.map, this.enemy)) {
            this.userInterface.print(this.state.name + " evading attack with no harm");
            // console.log(this.state.name + " evading attack with no harm");
            return;
        };
    }

    this.state.removeHp(dmg);

    if (!this.ensureIsAlive()) {
        // console.log(this.state.name + " died because of war");
        this.userInterface.print(this.state.name + " died because of war");
        this.map.removeUnit(this);
        this.notify();
    }
};

function Vampire(name, hp, dmg) {
    Unit.apply(this, arguments);
    this.attackMethod = new VampireAttack(this);
    this.ability = new Vampirism(this);
    this.immunity = true;
    this.undead = true;
    this.icon = "V";
};

Vampire.prototype = Object.create(Unit.prototype);

function Werewolf(name, hp, dmg) {
    Unit.apply(this, arguments);
    this.attackMethod = new WerewolfAttack(dmg);
    this.ability = new Transformation(this);
    this.immunity = true;
    this.state = new State(name + " as Human", hp, dmg);
    this.wolfState = new State(name + " as Wolf", hp * 2, dmg * 2);
    this.icon = "W";
};

Werewolf.prototype = Object.create(Unit.prototype);

Werewolf.prototype.act = function (unitLocation) {
    // console.log("[" + this + "] turn");
    this.userInterface.print("[" + this + "] turn");

    var enemies = this.map.searchAllEnemies(this);
    var target = this.chooseNearestEnemy(enemies, unitLocation);

    if (Math.random() > 0.7) {
        this.ability.action();
        
        if (!this.ensureIsAlive()) {
            return;
        }
    }

    if (unitLocation.distance(target) <= this.getAttackDistance()) {
        this.attack(target.getUnit());
        return;
    }

    this.move(this.map.findPathToEnemy(unitLocation, target));
};

Werewolf.prototype.takeMagicDamage = function (dmg) {
    if (this.wolf) {
        this.takeDamage(dmg * 2);
    } else {
        this.takeDamage(dmg);
    }
};