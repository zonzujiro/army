"use strict"

$(function () {
    var ui = new UserInterface();
    var field = new Map(ui);
    var addedUnits = [];
    
    $("#info").html(ui.about);
    
    $("#units").click(function() {
        $("#list").html(ui.unitsOutput);
    });

    $("#abilities").click(function() {
        $("#list").html(ui.abilitiesOutput);
    });

    $("#spells").click(function() {
        $("#list").html(ui.spellsOutput);
    });
    
     $("#about").click(function() {
        $("#info").html(ui.about);
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
        var index = $(".active").attr("id");
        var unit = ui.units[this.id](),
            oldUnit = field.map[index].unit;            
        
        if (oldUnit != null) {
            addedUnits.splice(addedUnits.indexOf(oldUnit), 1);
        }
                
        field.addUnit(unit, index);
        addedUnits.push(unit);
        $("#addUnitMenu").css("display", "none");  
    });
    
     $("body").on("click", ".cell", function(clicked) {
        $(".cell.active").removeClass("active");
        $("#addUnitMenu").html(ui.addUnitMenu);
        $("#addUnitMenu").css("left", clicked.pageX + "px");
        $("#addUnitMenu").css("top", clicked.pageY + "px");
        $("#addUnitMenu").css("display", "inline");        
        $(this).addClass("active");
    });
     
    $("body").on("click", "#log", function() {
        $("#info").html(ui.output);
    });
     
    $("body").on("click", "#start", function() {
        addedUnits.forEach(function(unit) { 
            unit.userInterface = ui; 
        });
        field.start();
    }); 
});
