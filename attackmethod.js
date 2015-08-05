function AttackMethod (dmg) {
	this.dmg = dmg;
};

AttackMethod.prototype.attack = function(enemy) {};
AttackMethod.prototype.counterAttack = function(enemy) {};

function DefaultAttack(dmg) {
	AttackMethod.apply(this, dmg);
};

DefaultAttack.prototype.attack = function(enemy) {
	enemy.takeDamage(dmg);
};
DefaultAttack.prototype.counterAttack = function(enemy) {
	enemy.takeDamage(dmg / 2);
};

function VampireAttack(self) {
	AttackMethod.apply(this, self.getDamage());
};

VampireAttack.prototype.attack = function(enemy) {
	if (enemy.getInfectPossibility()) {
		enemy.setAbility(new Vampirism(enemy));
		enemy.setAttackMethod(new VampireAttack(enemy));
		enemy.setName("Vampire " + enemy.getName());
		enemy.changeInfectPossibility();
		enemy.changeIsUndead();
	}
	
	enemy.takeDamage(this.dmg);
	this.self.useAbility();
};
VampireAttack.prototype.counterAttack = function(enemy) {
	this.self.useAbility();
	enemy.takeDamage(this.dmg / 2);
};