"use strict"

class AttackMethod {
    constructor(dmg) {
        this.dmg = dmg;
        this.distance = 1;
    }
}

class DefaultAttack extends AttackMethod {
    attack(enemy) {
        enemy.takeDamage(this.dmg);
    }

    counterattack(enemy) {
        enemy.takeDamage(this.dmg / 2);
    }
};

class RangeAttack extends DefaultAttack {
    constructor(dmg) {
        super(dmg);
        this.distance = 3;
    }
}

class WerewolfAttack extends AttackMethod {
    attack(enemy) {
        enemy.takeDamage(this.dmg);

        if (!enemy.immunity) {
            enemy.wolfState = new State(enemy.name + " as Wolf", enemy.maxHp * 2, enemy.dmg * 2);
            enemy.state.name = enemy.name + " as Human";
            enemy.ability = new Transformation(enemy);
            enemy.attackMethod = new WerewolfAttack(enemy.dmg);
            enemy.immunity = true;
            enemy.act = Werewolf.prototype.act;
        }
    }

    counterattack(enemy) {
        enemy.takeDamage(this.dmg / 2);
    }
}

class VampireAttack extends AttackMethod {
    constructor(self) {
        super(self.state.dmg);
        this.self = self;
    }

    attack(enemy) {
        enemy.takeDamage(this.dmg);
        this.self.ability.action();

        if (!enemy.immunity) {
            enemy.state.name = "Vampire " + enemy.name;
            enemy.ability = new Vampirism(enemy);
            enemy.attackMethod = new VampireAttack(enemy);
            enemy.immunity = true;
            enemy.undead = true;
            enemy.takeDamage = Unit.prototype.takeDamage;
        }
    }

    counterattack(enemy) {
        this.self.ability.action();
        enemy.takeDamage(this.dmg / 2);
    }
}