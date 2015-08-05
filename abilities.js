function Vampirism(target) {
	this.target = target;
};

Vampirism.prototype.action = function() {
	this.target.addHitPoints(this.target.getDamage / 4);
};

function Transformation(target) {
	this.target = target;
};

Transformation.prototype.action = function() {
	var tmp = this.target.getState();	
	var hpDifference = this.target.getMaxHp() - this.target.getCurrentHp();
	
	this.target.setState(this.target.getWolfState());
	this.target.setWolfState(tmp);
	this.target.changeIsWolf();
	this.target.takeDamage(hpDifference);
};