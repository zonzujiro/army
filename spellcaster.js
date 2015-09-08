"use strict"

class Spellcaster extends Unit {
    constructor(name, hp, dmg, mana) {
        super(name, hp, dmg);
        this.spell;
        this.mana = mana;
        this.maxMana = mana;
        this.spellbook = new Spellbook();
        this.attackMethod = new RangeAttack(dmg);
    }
    
    get attackDistance() {
        if (!this.wolf && this.spell.cost <= this.mana) {
            return this.spell.range;
        }
        return this.attackMethod.distance;
    }
    
    act(unitLocation) {
        if (this.mana < this.maxMana) {
            this.addMana(10);
        }

        if (this.state.hp < this.state.maxHp && this.mana >= this.spellbook.getSpell("Heal").cost) {
            if (this.spell.name != "Heal") {
                var oldSpell = this.spell.name;

                this.changeSpell("Heal");
                this.useSpell(this);
                this.spell = this.spellbook.getSpell(oldSpell);
            } else {
                this.useSpell(this);
            }
        }

        super.act(unitLocation);
    }
    
    attack(enemy) {
        enemy.enemy = this;

        if (!this.wolf && this.mana >= this.spell.cost) {
            this.useSpell(enemy);
            return;
        }

        this.attackMethod.attack(enemy);
        enemy.counterattack(this);
    }
    
    counterattack(enemy) {
        if (this.hp > 0) {
            enemy.enemy = this;

            if (!this.wolf && this.mana >= this.spell.cost) {
                this.useSpell(enemy);
                return;
            }

            this.attackMethod.counterattack(enemy);
        }
    }
    
    addMana(value) {
        var mp = this.mana + value;

        if (mp > this.maxMana) {
            this.mana = this.maxMana;
            return;
        }
        this.mana = mp;
    }
    
    useSpell(target) {
       this.userInterface.print(this.state.name + " using " + this.spell.name + " [Dmg: " + this.spell.effect + "] on a " + target.state.name);
        this.mana -= this.spell.cost;
        this.spell.action(target);
    }
    
    changeSpell(name) {
        this.spell = this.spellbook.getSpell(name);
    }
    
    toString() {
        return this.state.toString() + " Mana: " + this.mana + "/" + this.maxMana;
    }
    
}

class Battlemage extends Spellcaster {
    constructor(name, hp, dmg, mana) {
        super(name, hp, dmg, mana);
        this.spellbook.addSpell(new Heal("Heal", 30, 30));
        this.spellbook.addSpell(new Fireball("Fireball", 40, 50));
    }
}

class Supportmage extends Spellcaster {
    constructor(name, hp, dmg, mana) {
        super(name, hp, dmg, mana);
        this.spellbook.addSpell(new Heal("Heal", 30, 60));
        this.spellbook.addSpell(new Fireball("Fireball", 40, 25));
    }
}

class Wizard extends Battlemage {
    constructor(name, hp, dmg, mana) {
        super(name, hp, dmg, mana);
        this.spell = this.spellbook.getSpell("Fireball");
        this.icon = "Wz";
    }
}

class Necromancer extends Battlemage {
    constructor(name, hp, dmg, mana) {
        super(name, hp, dmg, mana);
        this.attackMethod = new RangeAttack(dmg);
        this.spell = this.spellbook.getSpell("Fireball");
        this.icon = "N";
    }
    
    useSpell(target) {
        target.addObserver(this);
        super.useSpell(target);
    }
}

class Warlock extends Battlemage {
    constructor(name, hp, dmg, mana) {
        super(name, hp, dmg, mana);
        this.spell = this.spellbook.getSpell("Fireball");
        this.icon = "Wk";
        this.slave = null;
    }
    
    act(unitLocation) {
        if (this.slave == null && this.mana > 50) {
            this.summon();
        }
        super.act(unitLocation);
    }
    
    attack(enemy) {
        var distanceToEnemy = this.location.distance(enemy.location);
        enemy.enemy = this;

        if (distanceToEnemy == 1 && this.slave != null) {
            this.userInterface.print(this.slave.state.name + " attacking " + enemy.state.name + " [Damage: " + this.slave.dmg + "]");
            this.slave.attack(enemy);
            return;
        }
        
        super.attack(enemy);
    }
    
    // counterattack(enemy) {
    //     if (this.ensureIsAlive()) {
    //         var distance = this.getLocation().distance(enemy.getLocation());

    //         if (distance > this.getAttackDistance()) {
    //             this.userInterface.print(this.state.name + " attacking " + enemy.state.name + " [Damage: " + this.getDamage() + "]");
    //             return;
    //         }

    //         if (!this.wolf && this.mana >= this.spell.cost) {
    //             this.useSpell(enemy);
    //             return;
    //         }

    //         enemy.enemy = this;
    //         this.attackMethod.counterattack(enemy);
    //     }
    // }
    
    freeSlave() {
        this.userInterface.print(this.name + " set his " + this.slave.name + " free");
        this.slave = null;
    }
    
    summon() {
        this.slave = new Demon("Demon", 250, 50, this, this.map);
        this.mana -= 50;
        this.slave.userInterface = this.userInterface;
        this.userInterface.print(this.name + " summons his pet: " + this.slave);
    }
    
    takeDamage(dmg) {
        if (this.slave != null && Math.random() > 0.5) {
            this.userInterface.print(this.slave.name + " covers his master [Damage: " + dmg + "]");
            this.slave.takeDamage(dmg);
            return;
        }
        
        super.takeDamage(dmg);
    }
    
    toString() {
        var out = this.name + " | HP: " + this.hp + "/" + this.maxHp + " MP: " + this.mana + "/" + this.maxMana + " Damage: " + this.dmg;

        if (this.slave != null) {
            out += " with " + this.slave.toString();
        }

        return out;
    }
}

class Healer extends Supportmage {
    constructor(name, hp, dmg, mana) {
        super(name, hp, dmg, mana);
        this.spell = this.spellbook.getSpell("Heal");
        this.icon = "H";
    }
}

class Priest extends Supportmage {
    constructor(name, hp, dmg, mana) {
        super(name, hp, dmg, mana);
        this.spell = this.spellbook.getSpell("Heal");
        this.icon = "P";
    }
    
    useSpell(target) {
        if (this.spell.name == "Heal" && target.undead) {
            this.mana -= this.spell.cost;
            this.userInterface.print(this.state.name + " using " + this.spell.name + " [Dmg: " + this.spell.effect + "] on a " + target.state.name);
            target.takeMagicDamage(this.spell.effect * 2);
            return;
        }
        
        super.useSpell(target);
    }
}
