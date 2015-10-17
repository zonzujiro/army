"use strict"

class State {
    constructor(name, hp, dmg) {
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.dmg = dmg;
    }

    addHp(value) {
        let total = parseInt(this.hp + value, 10);

        if (total > this.maxHp) {
            this.hp = this.maxHp;
            return;
        }
        this.hp = total;
    }

    removeHp(value) {
        value = parseInt(value, 10);

        if (value > this.hp) {
            this.hp = 0;
            return;
        }
        this.hp -= value;
    }

    toString() {
        return this.name + " | HP: " + this.hp + "/" + this.maxHp + " Damage: " + this.dmg;
    }
}