function State(name, hp, dmg) {
    this.hp = hp;
    this.maxHp = hp;
    this.dmg = dmg;
    this.ability = null;
};

State.prototype.getStateCurrentHp = function() { 
    return this.hp; 
};

State.prototype.getStateMaxHp = function() { 
    return this.maxHp; 
};

State.prototype.getStateDamage = function() { 
    return this.damage; 
};

State.prototype.getStateName = function() { 
    return this.name; 
};

State.prototype.newStateName = function(name) { 
    this.name = newName; 
};         
        
State.prototype.newStateAbility = function(ability) { 
    this.ability = ability; 
};

State.prototype.newStateDamage = function(dmg) {
    this.dmg = dmg;
};

State.prototype.useStateAbility = function() { 
    if (this.ability != null) {
        this.ability.action();               
    }
};
    
State.prototype.removeHp = function(value) {       
    if (value > this.hp) {
        this.hp = 0;
        return;
    }
    this.hp -= value;
};

State.prototype.addHp = function(value) {
    var total = this.hp + value;
    
    if (total > maxHp) {
        this.hp = this.maxHp;
        return;
    }
    this.hp = total;
};

State.prototype.toString = function() {
    return this.name + " [HP: " + this.hp + "/" + this.maxHp + " Damage: " + this.dmg + "]";
};