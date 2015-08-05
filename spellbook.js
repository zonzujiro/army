function Spellbook () {
	this.spellbook = {};
	
	this.spellbook.push(new Heal("Heal", 30, 60));
	this.spellbook.push(new Fireball("Fireball", 40, 50));
};

Spellbook.prototype.getSpell = function(spell) {
	return this.spellbook[spell];
};

Spellbook.prototype.addSpell = function(spell) {
	this.spellbook.push(spell);
	// spellbook[spell.getName()] = spell;
};

Spellbook.prototype.removeSpell = function(spell) {
	var index = spellbook.indexOf(spell);
	
	if (index != -1) {
		spellbook.splice(index, 1);
	}	
};

Spellbook.prototype.changeSpell = function(name) {
	for (var i = 0; i < spellbook.length(); i++) {
		if (spellbook[i].getName() == name) {
			spell = spellbook[i];
		};
	}
};