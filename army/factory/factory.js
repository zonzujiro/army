"use strict"

class Factory {
	constructor(sources) {
		this.units = {
            archer:      function () { return new Archer("Archer", 150, 35) },
            soldier:     function () { return new Soldier("Soldier", 200, 20) },
            berserker:   function () { return new Berserker("Berserker", 200, 20) },
            rogue:       function () { return new Rogue("Rogue", 175, 30) },
            werewolf:    function () { return new Werewolf("Werewolf", 150, 15) },
            vampire:     function () { return new Vampire("Vampire", 200, 25) },
            wizard:      function () { return new Wizard("Wizard", 150, 10, 200) },
            warlock:     function () { return new Warlock("Warlock", 170, 15, 150) }, 
            priest:      function () { return new Priest("Priest", 160, 15, 300) },
            healer:      function () { return new Healer("Healer", 130, 10, 300) },
            necromancer: function () { return new Necromancer("Necromancer", 200, 20, 200) }
        };
        
        this.images = {
        	archer:   function () { return new Icon(sources.units.archer) },
        	soldier:  function () { return new Icon(sources.units.soldier) },    	
    		mountain: function () { return new Icon(sources.landscape.mountain) }
        }
        
        this.map = {
            history: {
                "*": function () { return new Landscape() }
            },
            
            empty: ["                                       ", //1
                    "                                       ", //2
                    "                                       ", //3
                    "                                       ", //4
                    "                                       ", //5
                    "                                       ", //6
                    "                                       ", //7
                    "                                       ", //8
                    "                                       ", //9
                    "                                       ", //10
                    "                                       ", //11
                    "                                       ", //12
                    "                                       ", //13
                    "                                       ", //14
                    "                                       ", //15
                    "                                       ", //16
                    "                                       ", //17
                    "                                       ", //18
                    "                                       ", //19
                    "                                       "], //20  
                                      
            mountain: [10, 30, 50, 70, 90, 110, 130]
        }
        
        this.bindAll(this.units);
        this.bindAll(this.images.units);
        this.bindAll(this.images.landscape);
	}
	
	bindAll(obj) {
        for (let prop in obj) {
            obj[prop] = obj[prop].bind(this);
        }
    }
}