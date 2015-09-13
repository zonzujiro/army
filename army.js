"use strict"

$(function () {
    var ui = new UserInterface();
    var field = new Map(ui);
    var addedUnits = new Set();
    
    $("#info").html(ui.library.about.game);
    $("#game").addClass("clicked");
    
    $("#start").click(function() {        
        addedUnits.forEach(function(unit) { 
            unit.userInterface = ui; 
        });        
       
        ui.startGame();
    });
    
    $(".item").click(function() {
        ui.showItemMenu(this.id);
    });

    $("body").on("click", ".cell", function(clickedCell) {
        ui.showCellMenu(clickedCell);
        $(this).addClass("active");
    });
    
    $("body").on("mouseenter", ".units", function () {
        ui.showHoverMenu($(this).attr("class"), this.id);    
    });
    
    $("body").on("mouseenter", ".abilities", function () {        
        ui.showHoverMenu($(this).attr("class"), this.id); 
    }); 

    $("body").on("mouseenter", ".spells", function () {
        ui.showHoverMenu($(this).attr("class"), this.id);
    }); 
    
    $("body").on("click", ".units", function () {
        var unit = ui.units[this.id]();
                
        field.addUnit(unit, $(".active").attr("id"));
        addedUnits.add(unit);
        
        $("#addUnitMenu").css({
            "visibility":"hidden",
            "opacity":0,
            "transition-delay":"visibility 0s linear 0.1s, opacity 0.2s linear"
        });
    });
        
});
