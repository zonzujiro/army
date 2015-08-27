"use strict"

$(function () {
    var ui = new UserInterface();
    var map = new Map(ui);
    var addedUnits = [];
    
    var warlock = ui.units.warlock();
    var soldier = ui.units.soldier(); 
    
    addedUnits.push(warlock);
    addedUnits.push(soldier);
    
    map.addUnit(warlock, 54);  
    map.addUnit(soldier, 53);   
    // map.addUnit(ui.units.warlock(), 11);  
    // map.addUnit(ui.units.vampire(), 13);    
    
    $("#units").click(function() {
        $("#list").html(ui.unitsOutput);
    });

    $("#abilities").click(function() {
        $("#list").html(ui.abilitiesOutput);
    });

    $("#spells").click(function() {
        $("#list").html(ui.spellsOutput);
    });

    $("body").on("mouseenter", ".unit", function () {
        $("#info").html(ui.bio[this.id]);
    });
    
    $("body").on("mouseenter", ".ability", function () {
        $("#info").html(ui.abilities[this.id]);
    }); 

    $("body").on("mouseenter", ".spell", function () {
        $("#info").html(ui.spells[this.id]);
    }); 
    
    $("body").on("click", ".unit", function () {
        var unit = ui.units[this.id]();
        
        map.addUnit(unit, $(".active").attr("id"));
        addedUnits.push(unit);
        $(".cell.active").removeClass("active");
    });
    
     $("body").on("click", ".cell", function(clicked) {
        $(".cell.active").removeClass("active");
        // ui.drawAddUnitMenu();
        
        if ($("#addUnitMenu").is(":hidden")) {
            console.log("worked");
            $("#addUnitMenu").slideDown("slow");
            $("#addUnitMenu").html(ui.addUnitMenu);
        } else {
            $("#addUnitMenu").hide();
        }
    
        
        // alert(clicked.pageX +', '+ clicked.pageY);
        
        $(this).addClass("active");
    });
     
    $("body").on("click", "#log", function() {
        $("#info").html(ui.output);
    });
     
    $("body").on("click", "#start", function() {
        addedUnits.forEach(function(unit) {
            if (addedUnits.indexOf(unit) != -1) {
                unit.userInterface = ui;
            }
        });
        map.start();
    }); 
});
