'use strict'

class Spellbook {
    constructor() {
        this.book = {};     
    }
    
    getSpell(name) {
        return this.book[name];
    }
    
    addSpell(spell) {        
        this.book[spell.name] = spell;
    }
}
