"use strict"

class Unit {
    constructor(name, hp, dmg, icon) {
        this.icon = icon;
        this.map;
        this.enemy;
        this.userInterface;
        this.location;
        this.state = new State(name, hp, dmg);
        this.wolfState = null;
        this.ability = null;
        this.immunity = false;
        this.wolf = false;
        this.undead = false;
        this.observers = new Set();
    }
    
    ensureIsAlive() {
        if (this.hp == 0) {
            this.userInterface.print(this.state.name + " died because of war");            
            this.map.removeUnit(this, this.map.convertToIndex(this.location.x, this.location.y));
            this.notify();
            return false;
        }
        return true;
    }
    
    get dmg() {
        return this.state.dmg;
    }
    
    get hp() {
        return this.state.hp;
    }
    
    get maxHp() {
        return this.state.maxHp;
    }
    
    get name() {
        return this.state.name;
    }
    
    get attackDistance() {
        return this.attackMethod.distance;
    }
    
    changeIsWolf() {
        this.wolf = !this.wolf;
    }
    
    act() {
        this.userInterface.print("[" + this + "] turn");
        // console.log("[" + this + "] turn");

        var enemies = this.map.searchAllEnemies(this);
        var target = this.chooseNearestEnemy(enemies, this.location).location;
        
        if (this.location.distance(target) <= this.attackDistance) {
            this.attack(target.unit);
            return;
        }

        this.location = this.map.findPathToEnemy(this.location, target);
        this.move(this.location);
    }
    
    move(loc) {
        this.map.moveToLocation(this, loc);
    }
    
    addHitPoints(hp) { 
        this.state.addHp(hp);
    }
    
    attack(enemy) {
        this.userInterface.print(this.name + " attacking " + enemy.name + " [Damage: " + this.dmg + "]");
        enemy.enemy = this;
        this.attackMethod.attack(enemy);
        enemy.counterattack(this);
    }
    
    counterattack(enemy) {
        if (this.hp > 0) {
            this.userInterface.print(this.state.name + " counterattacking " + enemy.state.name + " [dmg: " + this.dmg / 2 + "]");
            enemy.enemy = this;
            this.attackMethod.counterattack(enemy);
        }
    }
    
    chooseNearestEnemy(enemies, loc) {
        return enemies.reduce(
            function (prev, current) {
                return loc.distance(current.location) > loc.distance(prev.location) ? prev : current;
            }
        );
    }
    
    takeDamage(dmg) {
        if (this.ensureIsAlive()) {
            this.state.removeHp(dmg);
            this.ensureIsAlive();
        }
    }
    
    takeMagicDamage(dmg) {
        this.takeDamage(dmg);
    }
    
    notify() {
        var self = this;        

        if (this.observers.size > 0) {
            this.userInterface.print(this.state.name + " gives " + parseInt(this.state.maxHp / 3, 10) + "hp to his observers");
            this.observers.forEach(function (observer) {
                observer.addHitPoints(self.maxHp / 3);
            });
        }
    }
    
    addObserver(observer) {
        this.observers.add(observer);
    }
    
    toString() {
        return this.state.toString();
    }
}

class Archer extends Unit {
    constructor(name, hp, dmg, icon) {
        super(name, hp, dmg, icon);
                
        this.attackMethod = new RangeAttack(dmg);
    }
}

class Soldier extends Unit {
    constructor(name, hp, dmg, icon) {
        super(name, hp, dmg, icon);
        
        this.attackMethod = new DefaultAttack(dmg);
        this.ability = new HideBehindShield(this);        
    }
    
    takeDamage(dmg) {
        if (this.ability.action(dmg)) {
            return;
        }
        super.takeDamage(dmg);
    }
}

class Demon extends Unit {
    constructor(name, hp, dmg, master, map) {
        super(name, hp, dmg);        
        this.attackMethod = new DefaultAttack(dmg);
        this.master = master;
        this.map = map;
        this.immunity = true;
        this.master.slave = this;
    }
    
    getLocation() {
        return this.map.searchUnitLocation(this.master);
    }
    
    takeDamage(dmg) {
        this.state.removeHp(dmg);

        if (this.hp == 0) {
            this.master.freeSlave();
        }
    }
}

class Berserker extends Unit {
    constructor(name, hp, dmg) {
        super(name, hp, dmg);
        
        this.attackMethod = new DefaultAttack(dmg);
        this.icon = "B";
    }
    
    takeMagicDamage(dmg) {
        this.userInterface.print("Berserker invulnerable to magic");
    }
}

class Rogue extends Unit {
    constructor(name, hp, dmg) {
        super(name, hp, dmg);
        
        this.attackMethod = new DefaultAttack(dmg);
        this.ability = new Evading(this, this.map);
        this.icon = "R";
    }
    
    attack(enemy) {
        enemy.enemy = this;
        enemy.takeDamage(this.dmg);
    }
    
    takeDamage(dmg) {
       if (Math.random() > 0.5) {
            if (this.ability.action(this.map, this.enemy)) {
                this.userInterface.print(this.state.name + " evading attack with no harm");
                return;
            };
        }
        
        super.takeDamage(dmg);
    }
}

class Vampire extends Unit {
    constructor(name, hp, dmg) {
        super(name, hp, dmg);
        
        this.attackMethod = new VampireAttack(this);
        this.ability = new Vampirism(this);
        this.immunity = true;
        this.undead = true;
        this.icon = "V";
    }    
}

class Werewolf extends Unit {
    constructor(name, hp, dmg) {
        super(name, hp, dmg);
        
        this.attackMethod = new WerewolfAttack(dmg);
        this.ability = new Transformation(this);
        this.immunity = true;
        this.state = new State(name + " as Human", hp, dmg);
        this.wolfState = new State(name + " as Wolf", hp * 2, dmg * 2);
        this.icon = "W";
    }
    
    act(unitLocation) {
        this.userInterface.print("[" + this + "] turn");

        var enemies = this.map.searchAllEnemies(this);
        var target = this.chooseNearestEnemy(enemies, this.location);

        if (Math.random() > 0.7) {
            this.ability.action();
            
            if (!this.ensureIsAlive()) {
                return;
            }
        }

        if (this.location.distance(target) <= this.attackDistance) {
            this.attack(target.unit);
            return;
        }

        this.move(this.map.findPathToEnemy(this.location, target));
    }
    
    takeMagicDamage(dmg) {
        if (this.wolf) {
            this.takeDamage(dmg * 2);
        } else {
            this.takeDamage(dmg);
        }
    }
}
