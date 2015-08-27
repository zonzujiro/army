function Ability(target) {
    this.target = target;
}

function Rage(target) {
    Ability.apply(this, arguments);
}

Rage.prototype.action = function() {
    this.target.attackMethod.dmg *= 2;
};

function HideBehindShield(target) {
    Ability.apply(this, arguments);
}

HideBehindShield.prototype.action = function (dmg) {
    if (Math.random() > 0.3) {
        this.target.userInterface.print(this.target.state.name + " covers behind a shield and takes less damage [Damage: " + parseInt(dmg / 4, 10) + "]");
        console.log(this.target.state.name + " covers behind a shield and takes less damage [Damage: " + parseInt(dmg / 4, 10) + "]");
        this.target.state.removeHp(dmg / 5);
        return true;
    }
    return false;
}

function Evading(target, map) {
    Ability.apply(this, arguments);
}

Evading.prototype.action = function (map, enemy) {
    var currentLocation = this.target.getLocation();
    var area = map.checkAreaAround(currentLocation);
    var attackDistance = this.target.getAttackDistance();
    var possibleMoves = area.filter(function (emptyCell) {
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
    var drainedHp = parseInt(this.target.getDamage() / 3);

    console.log(this.target.state.name + " drained " + drainedHp + "hp");
    this.target.addHitPoints(drainedHp);
};

function Transformation(target) {
    Ability.apply(this, arguments);
};

Transformation.prototype.action = function () {
    var tmp = this.target.state;
    var hpDifference = this.target.getMaxHp() - this.target.getCurrentHp();

    this.target.state = this.target.wolfState;
    this.target.wolfState = tmp;
    this.target.changeIsWolf();
    this.target.state.removeHp(hpDifference);
    this.target.ensureIsAlive();

    this.target.userInterface.print(this.target.state.name + " transformed");
    console.log(this.target.state.name + " transformed");
};
