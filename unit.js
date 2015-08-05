function Unit(name, hp, dmg) {
    this.state = new State(name, hp, dmg);
    this.wolfState = null;
    this.infectPossibility = true;
    this.isWolf = false;
    this.isUndead = false;
    this.icon = " ";
    this.map = [];
};

Unit.prototype.ensureIsAlive = function () {
    if (this.getCurrentHp() == 0) {
        return false;
    }
    return true;
};

Unit.prototype.getDamage = function () {
    return this.state.getStateDamage();
};

Unit.prototype.getCurrentHp = function () {
    return this.state.getStateCurrentHp();
};

Unit.prototype.getMaxHp = function () {
    return this.state.getStateMaxHp();
};

Unit.prototype.getName = function () {
    return this.state.getStateName();
};

Unit.prototype.getState = function () {
    return this.state;
};

Unit.prototype.getWolfState = function () {
    return this.wolfState;
}

Unit.prototype.getInfectPossibility = function () {
    return this.infectPossibility;
};

Unit.prototype.getIsWolf = function () {
    return this.isWolf;
};

Unit.prototype.getIsUndead = function () {
    return this.isUndead;
}

Unit.prototype.getIcon = function () {
    return this.icon;
};

Unit.prototype.getLocation = function () {
    return field.searchUnitLocation(this);
};

Unit.prototype.getActionPoints = function () {
    return this.actionPoints;
};

Unit.prototype.getAttackRange = function () {
    return attackMethod.getRange();
};

Unit.prototype.changeInfectPossibility = function () {
    this.infectPossibility = !infectPossibility;
};

Unit.prototype.changeIsWolf = function () {
    this.isWolf = !isWolf;
};

Unit.prototype.changeIsUndead = function () {
    this.isUndead = !isUndead;
};

Unit.prototype.setAbility = function (newAbility) {
    this.state.newStateAbility(newAbility);

    if (this.wolfState != null) {
        this.wolfState.newStateAbility(newAbility);
    }
};

Unit.prototype.setAttackMethod = function (newMethod) {
    this.attackMethod = newMethod;
};

Unit.prototype.setName = function setName(newName) {
    state.newStateName(newName);
};

Unit.prototype.setState = function (newState) {
    this.state = newState;
}

Unit.prototype.setWolfState = function (newState) {
    this.wolfState = newState;
};

Unit.prototype.setIcon = function (icon) {
    this.icon = icon;
};

Unit.prototype.act = function(index) {
    
};

Unit.prototype.addHitPoints = function (hp) {
    if (ensureIsAlive()) {
        this.state.addHp(hp);
    }
};

Unit.prototype.attack = function (enemy) {
    this.attackMethod.attack(enemy);
    enemy.counterAttack(this);
};

Unit.prototype.counterAttack = function (enemy) {
    if (!ensureIsAlive()) {
        return;
    }

    this.attackMethod.counterAttack(enemy);
};

Unit.prototype.takeDamage = function (dmg) {
    if (ensureIsAlive()) {
        this.state.removeHp(dmg);
    }
};

Unit.prototype.takeMagicDamage = function (dmg) {
    if (ensureIsAlive()) {
        this.takeDamage(dmg);
    }
};

Unit.prototype.useAbility = function () {
    if (ensureIsAlive()) {
        this.state.useAbility();
    }
};

Unit.prototype.toString = function () {
    return this.getName() + " [HP: " + this.getCurrentHp() + "/" + this.getMaxHp() + " Damage: " + this.getDamage() + "]";
};

function Soldier(name, hp, dmg) {
    Unit.apply(this, arguments);
    this.attackMethod = new DeffaultAttack(dmg);
};

function Berserker(name, hp, dmg) {
    Unit.apply(this, arguments);
    this.attackMethod = new DeffaultAttack(dmg);
};

Berserker.prototype.takeMagicDamage = function (dmg) {
    return "Berserker invulnerable to magic";
};

Berserker.prototype.addHitPoints = function (hp) {
    return "Berserker invulnerable to magic";
};

function Rogue(name, hp, dmg) {
    Unit.apply(this, arguments);
    this.attackMethod = new DeffaultAttack(dmg);
};

Rogue.prototype.attack = function (enemy) {
    enemy.takeDamage(this.dmg);
};

function Vampire(name, hp, dmg) {
    Unit.apply(name, hp, dmg);
    this.attackMethod = new VampireAttack(this);
    this.infectPossibility = false;
    this.isUndead = true;
    this.setAbility(new Vampirism(this));
};

Vampire.prototype.setAbility = function (newAbility) {
    this.state.newStateAbility(newAbility);
};

function Werewolf(name, hp, dmg) {
    Unit.apply(name, hp, dmg);
    this.attackMethod = new WerewolfAttack(dmg);
    this.state = new State(name + " as Human", hp, dmg);
    this.wolfState = new State(name + " as Wolf", hp * 2, dmg * 2);
    this.setAbility(new Transformation(this));
};

Werewolf.prototype.takeMagicDamage = function (dmg) {
    if (this.isWolf) {
        this.takeDamage(dmg * 2);
    } else {
        this.takeDamage(dmg);
    }
};