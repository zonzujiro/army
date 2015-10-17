'use strict'

class Spell {
    constructor(name, cost, effect) {
        this.name = name;
        this.cost = cost;
        this.effect = effect;
        this.range = 3;
    }
}

class Heal extends Spell {
    action(target) {
        target.addHitPoints(this.effect);
    }
}

class Fireball extends Spell {
    action(target) {
        target.takeMagicDamage(this.effect);
    }
}