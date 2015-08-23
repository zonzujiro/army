function AttackMethod(dmg) {
    this.dmg = dmg;
    this.distance = 1;
};

AttackMethod.prototype.getDistance = function () {
    return this.distance;
};

function DefaultAttack(dmg) {
    AttackMethod.apply(this, arguments);
};

DefaultAttack.prototype = Object.create(AttackMethod.prototype);

DefaultAttack.prototype.attack = function (enemy) {
    enemy.takeDamage(this.dmg);
};

DefaultAttack.prototype.counterattack = function (enemy) {
    enemy.takeDamage(this.dmg / 2);
};

function RangeAttack(dmg) {
    AttackMethod.apply(this, arguments);
    this.distance = 3;
}

RangeAttack.prototype = Object.create(DefaultAttack.prototype);

function WerewolfAttack(dmg) {
    AttackMethod.apply(this, arguments);
}

WerewolfAttack.prototype = Object.create(AttackMethod.prototype);

WerewolfAttack.prototype.attack = function (enemy) {
    enemy.takeDamage(this.dmg);

    if (!enemy.immunity) {
        enemy.setName(enemy.getName() + " as Human");
        enemy.wolfState = new State(enemy.getName() + " as Wolf", enemy.getMaxHp() * 2, enemy.getDamage() * 2);
        enemy.ability = new Transformation(enemy);
        enemy.attackMethod = new WerewolfAttack(enemy.getDamage());
        enemy.immunity = true;
        enemy.act = Werewolf.prototype.act;
    }
};

WerewolfAttack.prototype.counterattack = function (enemy) {
    enemy.takeDamage(this.dmg / 2);
};

function VampireAttack(self) {
    this.self = self;
    this.dmg = self.getDamage();
    this.distance = 1;
};

VampireAttack.prototype = Object.create(AttackMethod.prototype);

VampireAttack.prototype.attack = function (enemy) {    
    enemy.takeDamage(this.dmg);
    this.self.ability.action();
    
    if (!enemy.immunity) {
        enemy.setName("Vampire " + enemy.getName());
        enemy.ability = new Vampirism(enemy);
        enemy.attackMethod = new VampireAttack(enemy);
        enemy.immunity = true;
        enemy.undead = true;
        enemy.takeDamage = Unit.prototype.takeDamage;
    }
};

VampireAttack.prototype.counterattack = function (enemy) {
    this.self.ability.action();
    enemy.takeDamage(this.dmg / 2);
};