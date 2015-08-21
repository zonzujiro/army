"use strict"

$(function () {
    var map = new Map();
    var s = new Soldier("Soldier", 200, 20);
    var b = new Berserker("Berserker", 200, 20);
    var r = new Rogue("Rogue", 175, 30);
    var w = new Werewolf("Werewolf", 150, 15);
    var v = new Vampire("Vampire", 200, 25);

    var wz = new Wizard("Wizard", 150, 10, 200);
    var wk = new Warlock("Warlock", 170, 15, 150);
    var p = new Priest("Priest", 160, 15, 300);
    var h = new Healer("Healer", 130, 10, 300);
    var n = new Necromancer("Necromancer", 200, 20, 200);

    // map.addUnit(r, 63);
    // map.addUnit(s, 6);
    // map.addUnit(b, 62);
    map.addUnit(w, 8);
    // map.addUnit(wz, 63);
    map.addUnit(wk, 11);
    // map.addUnit(p, 49);
    map.addUnit(v, 13);
    // map.addUnit(n, 63);

    // console.log(s.toString());
    // console.log(n.toString());

    map.draw();
    // map.start();
    // map.draw();

    $("#start").click(function() {
        map.start();
    }); 

    // console.log(s.toString());
    // console.log(r.toString());

});
