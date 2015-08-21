function Spellbook() {
    this.spellbook = [];
};

Spellbook.prototype.getSpell = function (name) {
    for (var i = 0; i < this.spellbook.length; i++) {
        if (this.spellbook[i].getName() == name) {
            return this.spellbook[i];
        };
    }
};

Spellbook.prototype.addSpell = function (spell) {
    this.spellbook.push(spell);
};

Spellbook.prototype.removeSpell = function (spell) {
    var index = spellbook.indexOf(spell);

    if (index != -1) {
        spellbook.splice(index, 1);
    }
};

Spellbook.prototype.changeSpell = function (name) {
    for (var i = 0; i < spellbook.length(); i++) {
        if (spellbook[i].getName() == name) {
            spell = spellbook[i];
        };
    }
};