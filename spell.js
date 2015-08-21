function Spell(name, cost, effect) {
    this.name = name;
    this.cost = cost;
    this.effect = effect;
    this.useDistance = 3;
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

Spell.prototype.getRange = function () {
    return this.useDistance;
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