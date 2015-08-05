function Spell (name, cost, effect) {
	this.name = name;
	this.cost = cost;
	this.effect = effect;
}

Spell.prototype.getCost = function() {
	return this.cost;
};

Spell.prototype.getEffect = function() {
	return this.effect;
};

Spell.prototype.getName = function() {
	return this.name;
};

function Heal(name, cost, effect) {
	Spell.apply(name, cost, effect);
};

Heal.prototype.action = function(target) {
	target.addHitPoints(effect);
};

function Fireball(name, cost, effect) {
	Spell.apply(name, cost, effect);
};

Fireball.prototype.action = function(target) {
	target.takeMagicDamage(effect);
};
