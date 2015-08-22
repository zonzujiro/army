"use strict"

$(function () {
    var map = new Map();
    var ui = new UserInterface();
        
    map.addUnit(ui.units.warlock(), 54);    
    map.addUnit(ui.units.vampire(), 53);   
    map.addUnit(ui.units.warlock(), 11);  
    map.addUnit(ui.units.vampire(), 13);    
    
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
        map.addUnit(ui.units[this.id](), $(".active").attr("id"));
        $(".cell.active").removeClass("active");
    });
    
     $("body").on("click", ".cell", function() {
        $(".cell.active").removeClass("active");
        $(this).addClass("active");
    });
     
    $("body").on("click", "#start", function() {
        map.start();
    }); 
});
