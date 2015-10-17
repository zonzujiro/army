"use strict"

class Ability {
    constructor(target) {
        this.target = target;
    }
}

class Rage extends Ability {
    action() {
        this.target.attackMethod.dmg *= 2;
    }
}

class HideBehindShield extends Ability {
    action(dmg) {
        if (Math.random() > 0.3) {
            this.target.userInterface.print(this.target.name + " covers behind a shield and takes less damage [Damage: " + parseInt(dmg / 4, 10) + "]");
            this.target.state.removeHp(dmg / 5);
            return true;
        }
        return false;
    }
}

class Evading extends Ability {
    action(map, enemy) {
        let area = map.checkAreaAround(this.target.location);
        let attackDistance = this.target.attackDistance;
        let possibleMoves = area.filter(function (emptyCell) {
            return emptyCell.distance(enemy.location) <= attackDistance;
        });

        if (possibleMoves.length > 0) {
            this.target.move(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
            return true;
        }
        return false;
    }
}

class Vampirism extends Ability {
    action() {
        let drainedHp = parseInt(this.target.dmg / 3);

        this.target.userInterface.print(this.target.state.name + " drained " + drainedHp + "hp");
        this.target.addHitPoints(drainedHp);
    }
}

class Transformation extends Ability {
    action() {
        let tmp = this.target.state;
        let hpDifference = this.target.maxHp - this.target.hp;

        this.target.state = this.target.wolfState;
        this.target.wolfState = tmp;
        this.target.changeIsWolf();
        this.target.state.removeHp(hpDifference);

        this.target.userInterface.print(this.target.state.name + " transformed");
    }
}