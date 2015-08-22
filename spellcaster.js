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

    if (this.ability instanceof Transformation && Math.random() > 0.5) {
        this.ability.action();
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

Spellcaster.prototype.attack = function (enemy) {
    enemy.enemy = this;

    if (!this.wolf && this.mana >= this.spell.cost) {
        this.useSpell(enemy);
        return;
    }

    this.attackMethod.attack(enemy);
    enemy.counterattack(this);
};

Spellcaster.prototype.counterattack = function (enemy) {
    if (this.ensureIsAlive()) {
        enemy.enemy = this;

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

    this.mana -= this.spell.cost;
    this.spell.action(target);
}

Spellcaster.prototype.changeSpell = function (name) {
    this.spell = this.spellbook.getSpell(name);
};

Spellcaster.prototype.toString = function () {
    return this.state.toString() + " Mana: " + this.mana + "/" + this.maxMana;
}

function Battlemage(name, hp, dmg, mana) {
    Spellcaster.apply(this, arguments);
    this.spellbook.addSpell(new Heal("Heal", 30, 30));
    this.spellbook.addSpell(new Fireball("Fireball", 40, 50));
}

Battlemage.prototype = Object.create(Spellcaster.prototype);

function Supportmage(name, hp, dmg, mana) {
    Spellcaster.apply(this, arguments);
    this.spellbook.addSpell(new Heal("Heal", 30, 60));
    this.spellbook.addSpell(new Fireball("Fireball", 40, 25));
}

Supportmage.prototype = Object.create(Spellcaster.prototype);

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

    target.enemy = this;
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

Warlock.prototype.act = function (unitLocation) {
    console.log("[" + this + "] turn");

    var enemies = this.map.searchAllEnemies(this);
    var target = this.chooseNearestEnemy(enemies, unitLocation);

    if (this.mana < this.maxMana) {
        this.addMana(10);
    }

    if (this.slave == null && this.mana > 50) {
        this.summon();
    }

    if (this.ability instanceof Transformation && Math.random() > 0.5) {
        this.ability.action();
    }

    if (this.state.hp < this.state.maxHp && this.mana >= this.spellbook.getSpell("Heal").cost) {
        if (this.spell.name != "Heal") {
            var tmp = this.spell;

            this.changeSpell("Heal");
            this.useSpell(this);
            this.spell = tmp;
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

Warlock.prototype.attack = function (enemy) {
    var distance = this.getLocation().distance(enemy.getLocation());
    enemy.enemy = this;

    if (distance == 1 && this.slave != null) {
        this.slaveAttack(enemy);
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
    console.log(distance);

    if (distance > this.attackMethod.getDistance()) {
        console.log(this.getName() + " tried to counterattack " + enemy.getName() + " but he too far");
        return;
    }

    if (!this.wolf && this.mana >= this.spell.getCost()) {
        this.useSpell(enemy);
        return;
    }

    enemy.enemy = this;
    this.attackMethod.counterattack(enemy);
};

Warlock.prototype.demon = function () {
    return this.slave;
};

Warlock.prototype.freeSlave = function () {
    console.log(this.getName() + " set his " + this.slave.getName() + " free");

    this.slave = null;
};

Warlock.prototype.setSlave = function (demon) {
    this.slave = demon;
};

Warlock.prototype.summon = function () {
    this.slave = new Demon("Demon", 250, 50, this, this.map);
    this.mana -= 50;
    console.log(this.getName() + " summons his pet: " + this.slave);
};

Warlock.prototype.slaveAttack = function (enemy) {
    console.log(this.slave.state.name + " attacking " + enemy.state.name + " [Damage: " + this.slave.attackMethod.dmg + "]");
    this.slave.attack(enemy);
};

Warlock.prototype.takeDamage = function (dmg) {
    if (this.ensureIsAlive()) {
        if (this.slave != null && Math.random() > 0.5) {
            console.log(this.slave.getName() + " covers his master [Damage: " + dmg + "]");
            this.slave.takeDamage(dmg);
            return;
        }

        this.state.removeHp(dmg);

        if (!this.ensureIsAlive()) {
            console.log(this.state.name + " died because of war");
            this.map.removeUnit(this);
            this.notify();
        }
    }
};

Warlock.prototype.toString = function () {
    var out = this.getName() + " | HP: " + this.getCurrentHp() + "/" + this.getMaxHp() + " MP: " + this.mana + "/" + this.maxMana + " Damage: " + this.getDamage();

    if (this.slave != null) {
        out += " with " + this.slave.toString();
    }

    return out;
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