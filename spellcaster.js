function Spellcaster(name, hp, dmg, mana) {
	Unit.apply(name, hp, dmg);
	
	this.mana = this.maxMana = mana;
	this.spellbook = new Spellbook();
	this.attackMethod = new DefaultAttack();
}

Spellcaster.prototype.getMana = function() {
	return this.mana;
};

Spellcaster.prototype.method_name = function() {
	return this.maxMana;
};

Spellcaster.prototype.addMana = function(value) {
	ensureIsAlive();
	
	var mp = mana + value;
	
	if (mp > maxMana) {
		mana = maxMana;
		return;
	}	
	mana = mp;
};

Spellcaster.prototype.changeSpell = function(spell) {
	ensureIsAlive();
	
	spell = spellbook.getSpell(spell);
};