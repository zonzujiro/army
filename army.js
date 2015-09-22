"use strict"

$(function () {
    var ui = new UserInterface();
    var field = new Field(ui);
    var addedUnits = new Set();
    var clickedX, clickedY;
    
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

    // $("body").on("click", ".cell", function(clickedCell) {
    //     ui.showCellMenu(clickedCell);
    //     $(this).addClass("active");
    // });

    $("body").on("click", "canvas", function(clicked) {
        let index = parseInt(clicked.offsetX / 30) + parseInt(clicked.offsetY / 30) * 40;
        // console.log(index);
        clickedX = clicked.offsetX;
        clickedY = clicked.offsetY;
        console.log("army.js [x: " + clickedX + " y: " + clickedY + " index: " + index + "]");
        ui.showCellMenu(clicked);
        
        // $(this).addClass("active");
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
                
        field.unitsInBattle.push(unit);
        field.addUnit(unit, clickedX, clickedY);
        addedUnits.add(unit);
        
        $("#addUnitMenu").css({
            "visibility":"hidden",
            "opacity":0,
            "transition-delay":"visibility 0s linear 0.1s, opacity 0.2s linear"
        });
    });
        
});
