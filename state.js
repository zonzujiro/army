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
    value = parseInt(value, 10);

    if (value > this.hp) {
        this.hp = 0;
        return;
    }
    this.hp -= value;
};

State.prototype.addHp = function (value) {
    var total = parseInt(this.hp + value, 10);

    if (total > this.maxHp) {
        this.hp = this.maxHp;
        return;
    }

    this.hp = total;
};

State.prototype.toString = function () {
    return this.name + " | HP: " + this.hp + "/" + this.maxHp + " Damage: " + this.dmg;
};