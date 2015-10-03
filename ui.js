"use strict"

class UserInterface {
    constructor(sources, army) {
        this.counter = 1;
        this.addUnitMenu = "";
        this.history = "";
        this.sources = sources;
        this.army = army;
        this.landscape = new Landscape();
        this.field;
        
        this.map = {
            history: {
                "*": function () { return new Landscape(this.sources.landscape.mountain) }
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
        
        this.units = {
            archer:      function () { return new Archer("Archer", 150, 35, this.sources.units.archer) },
            soldier:     function () { return new Soldier("Soldier", 200, 20, this.sources.units.soldier) },
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
        
        this.library = {            
            units: {
                soldier: "<h1>S - Soldier</h1><p>Simple close combat unit. Can use shield.</p><p><b>Health:</b> 200 | <b>Damage:</b> 20 | <b>Icon on field:</b> S </p><p><i>Note: soldier will rise shield with 70% chance. If shield raised up - incoming damage reduced to 1/4 from the original.</i></p>",
                berserker: "<h1>B - Berserker</h1><p>Invulnerable to magic and have rage state which double his damage.<p><b>Health:</b> 230 | <b>Damage:</b> 30</p></p><p><i>Note: when rage state is turned on, it can't be turned off.",
                rogue: "<h1>R - Rogue</h1><p>Can evade attacks and when he attacking, units do not counterattacks him.<p><b>Health:</b> 175 | <b>Damage:</b> 30</p></p><p><i>Note: evade chance - 30%. If rogue evaded attack, he receives no damage.",
                archer: "<h1>A - Archer</h1><p>Simple range unit. <p><b>Health:</b> 175 | <b>Damage:</b> 50</p></p>",
                werewolf: "<h1>W - Werewolf</h1><p>Close combat unit with two states - human and wolf. In wolf state have more hit points and damage. Can infect other units (excluding Demon and Vampire) and make them a werewolf to.</p><p><b>Health:</b> 150 | <b>Damage:</b> 15</p><p><i>Note: werewolf can transform in the begining of each turn with 50% chance. If he have to low hp for transforming - he will die.</i></p>",
                vampire: "<h1>V - Vampire</h1><p>Undead close combat unit. Heals himself when attacking or counterattacking. Infects other units.</p><p><b>Health:</b> 200 | <b>Damage:</b> 25</p><p><i>Note: vampirism heals vampire on 1/4 from damage every hit.</i></p>",
                demon: "<h1>D - Demon</h1><p>Strong close combat unit. Can cover his master from attacks.</p><p><b>Health:</b> 250 | <b>Damage:</b> 50</p><p><i>Note: can't be infected. Demon always standing near his master and attacking only when his master told him so. Not displayed on the field.</i></p>",
                wizard: "<h1>Wz - Wizard</h1><p>Standard battle mage. Attacking and counterattacking with spells.</p><p><b>Health:</b> 150 | <b>Mana:</b> 200 | <b>Damage:</b> 10</p><p><i>Note: healing twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn.</i></p>",
                healer: "<h1>H - Healer</h1><p>Standard support mage. Attacking and counterattacking with spells. Battle spells twice weaker.</p><p><b>Health:</b> 130 | <b>Mana:</b> 300 | <b>Damage:</b> 10</p><p><i>Note: battle spells twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn.</i></p>",
                priest: "<h1>P - Priest</h1><p>Support mage. Attacking and counterattacking with spells. Healing deals damage to undead units with double damage.</p><p><b>Health:</b> 160 | <b>Mana:</b> 300 | <b>Damage:</b> 15</p><p><i>Note: battle spells twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn.</i></p>",
                warlock: "<h1>Wk - Warlock</h1><p>Battle mage. Attacking and counterattacking with spells. Can summon Demon.<p><b>Health:</b> 170 | <b>Mana:</b> 150 | <b>Damage:</b> 15</p></p><p><i>Note: healing spells twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn. Demon can cover his master with 30% chance. If this happens - warlock have no damage from attack. In close combat warlock always use demon.</i></p>",
                necromancer: "<h1>N - Necromancer</h1><p>Battle mage. Heal himself when his target dying.</p><p><b>Health:</b> 200 | <b>Mana:</b> 200 | <b>Damage:</b> 20</p><p><i>Note: healing spells twice weaker. Like other mages, heals himself every turn if have enough mana. Have mana regeneration in amount of 10 mp/turn. Dying target gives necromancer 1/3 from maximum of health points.</i></p>"
            },

            abilities: {
                evading: "<h1>Evading</h1><p>Ability of the Rogue. Allows rogue to evade attacks without taking damage. When ability triggers, rogue moves to the random cell nearby with his enemy. Working when somebody trying to attack rogue.</p><p><b>Chance:</b> 30% </p>",
                shield: "<h1>Hide behind a shield</h1><p>Ability of the Soldier. Reduces incoming damage from magic and physic attack. Working when somebody trying to attack soldier.</p><p><b>Chance:</b> 70%</p>",
                transform: "<h1>Transformation</h1><p>Ability of the Werewolf. Allows transform werewolf in to wolf or in to human. In wolf form werewolf have double health and damage. The werewolf tries to use the ability at the beginning of each turn.</p><p><b>Chance:</b> 70%</p>",
                vampirism: "<h1>Vampirism</h1><p>Ability of the Vampire. Allows the vampire to be treated during the attack. Healing amount - 1/4 of damage.</p><p><b>Chance:</b> always</p>"
            },
            
            spells: {
                fireball: "<h1>Fireball</h1><p>Fireball... fires.</p><p><b>Damage:</b> 50 | <b>Mana cost:</b> 40</p>",
                healing: "<h1>Healing</h1><p>Healing... heals.</p><p><b>Effect:</b> 60 | <b>Mana cost:</b> 30</p>"
            },
            
            about: {
                game: "<h1>Army <i>beta</i></h1><p>It's a simple game. Place units on the field and then press start. Units have very simple AI and will attack each other. Also, they have unique abilities and some units can use magic. This is all. Have fun!</p><p>Special thanx to: <a href='https://github.com/kekal'>kekal</a>, <a href='https://github.com/dimkalinux/'>dimkalinux</a>, <a href='https://twitter.com/charming_elle' style='color: lightcoral;'>charming_elle</a> and <a href='http://zy0rg.deviantart.com/'>zy0rg</a>.</p><p>Project on <a href='https://github.com/zonzujiro/armyJS'>github</a>",
                units: "<p>There are several tipe of units. Everyone can move and attack. :) Some of them have unique abilities, some of them can use magic.</p><p>Simple units, like Soldier or Berserker have only hitpoints and damage amount. Mages, like Wizzard or Healer, also have mana points.</p>",
                abilities: "<p>Some units have unique abilities. Each unit will use own ability automaticly.</p>",
                spells: "<p>Mages can use magic. Surprise!</p>",
                log: "" 
            }      
        }            
        
        this.list = {            
            units: "",
            abilities: "",
            spells: "",
            game:""
        };
        
        for (let value in this.library.abilities) {
            this.list.abilities += '<li id="'+ value + '" class="abilities">' + value.slice(0,1).toUpperCase() + value.slice(1) + '</li>';
        }

        for (let value in this.library.spells) {
            this.list.spells += '<li id="'+ value + '" class="spells">' + value.slice(0,1).toUpperCase() + value.slice(1) + '</li>';
        }
        
        for (let value in this.units) {
            this.list.units += '<li id="'+ value + '" class="units">' + value.slice(0,1).toUpperCase() + value.slice(1) + '</li>';
            this.addUnitMenu += '<p id="'+ value + '" class="units">' + value.slice(0,1).toUpperCase() + value.slice(1) + '</p>';
        }
        
        this.bindAll(this.units);
        this.bindAll(this.map.history);
    }
    
    bindAll(obj) {
        for (let prop in obj) {
            obj[prop] = obj[prop].bind(this);
        }
    }
    
    drawCanvas(obj) {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // this.drawGridInCanvas(ctx);
        
        obj.forEach(function(obj) {
            ctx.drawImage(obj.icon, obj.location.imgX, obj.location.imgY);
        });
    };
    
    drawGridInCanvas(ctx) {
        for (let x = 0; x < 1200; x += this.field.cellSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 600);
        }
        
        for (let y = 0; y < 600; y += this.field.cellSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(1200, y);
        }  
        ctx.stroke();      
    }

    endGame() {
        var library = this.library;
        var list = this.list;
        var addUnitMenu = this.addUnitMenu;
        
        $("#info").removeClass("inBattle");
        $(".item").removeClass("inactive");
        
        $(".item").click(function () {
            $("#info").html(library.about[this.id]);
            $("#list").html(list[this.id]);
            $("li").removeClass("clicked");
            $("#" + this.id).addClass("clicked");
            $("#addUnitMenu").css("display", "none");  
        });
        
        $("body").on("click", ".cell", function (clicked) {
            $(".cell.active").removeClass("active");
            $("#addUnitMenu").html(addUnitMenu);
            $("#addUnitMenu").css("left", clicked.pageX + "px");
            $("#addUnitMenu").css("top", clicked.pageY + "px");
            $("#addUnitMenu").css("display", "inline");        
            $(this).addClass("active");
        }); 
    }
        
    startGame() {
        $("#start").removeClass("clicked");
        $("#list").html("");
        $("#info").addClass("inBattle");        
        $(".item").off();
        $(".item").addClass("inactive");
        $(".item").removeClass("clicked");
        $("#log").addClass("clicked");
        this.field.start();
    };

    
    print(text) {
        var string = '<p id="string"># ' + this.counter + " | " + text + '</p>';
        
        this.counter += 1;
        this.history = string + this.history;
        $("#info").html(this.history);
    };
    
    showItemMenu(item) {
        $("#info").html(this.library.about[item]);
        $("#list").html(this.list[item]);
        $("li").removeClass("clicked");
        $("#" + item).addClass("clicked");
        $("#addUnitMenu").css({
            "visibility":"hidden",
            "opacity":0,
            "transition-delay":"visibility 0s linear 0.1s, opacity 0.2s linear"
        });
    }
    
    showHoverMenu(category, article) {
        $("#info").html(this.library[category][article]);
    }
    
    showCellMenu(cell) {
        $(".cell.active").removeClass("active");     
        $("#addUnitMenu").html(this.addUnitMenu);
        $("#addUnitMenu").css("left", cell.pageX + "px");
        $("#addUnitMenu").css("top", cell.pageY + "px");
        $("#addUnitMenu").css({
            "visibility":"visible",
            "opacity":1,
            "transition-delay":"0s"
        });   
    }        
}
