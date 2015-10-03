"use strict"

$(function () {
    var army = new Army();
    
    $("#game").addClass("clicked");
    $("#start").click(function() {
        army.addedUnits.forEach(function(unit) { 
            unit.userInterface = army.ui; 
        });
        
        army.ui.startGame();
    });
    
    $(".item").click(function() {
        army.ui.showItemMenu(this.id);
    });
    
    // document.getElementById("canvas").addEventListener("click", function (clicked) {
    //     army.clickedX = clicked.offsetX;
    //     army.clickedY = clicked.offsetY;
        
    //     // console.log("army.js [x: " + army.clickedX + " y: " + army.clickedY + " index: " + index + "]");
    //     army.ui.showCellMenu(clicked);
    // });
    document.getElementById("canvas").onclick = function (clicked) {
        army.clickedX = clicked.offsetX;
        army.clickedY = clicked.offsetY;
        
        // console.log("army.js [x: " + army.clickedX + " y: " + army.clickedY + " index: " + index + "]");
        army.ui.showCellMenu(clicked);
    };
    
    // document.getElementById("units").addEventListener("mouseenter", function () {
    //     army.ui.showHoverMenu($(this).attr("class"), this.id); 
    // });
    
    $("body").on("mouseenter", ".units", function () {
        army.ui.showHoverMenu($(this).attr("class"), this.id);    
    });

    // document.getElementById("abilities").addEventListener("mouseenter", function () {
    //     army.ui.showHoverMenu($(this).attr("class"), this.id); 
    // });
    
    $("body").on("mouseenter", ".abilities", function () {        
        army.ui.showHoverMenu($(this).attr("class"), this.id); 
    }); 

    // document.getElementById("spells").addEventListener("mouseenter", function () {
    //     army.ui.showHoverMenu($(this).attr("class"), this.id); 
    // });
    

    $("body").on("mouseenter", ".spells", function () {
        army.ui.showHoverMenu($(this).attr("class"), this.id);
    }); 
    
    // document.getElementByClassName("units").addEventListener("click", function () {
    //     console.log(123);
    //     let unit = army.ui.units[this.id]();
                
    //     army.field.addUnit(unit, army.field.convertToIndex(parseInt(army.clickedX / army.field.cellSize), parseInt(army.clickedY / army.field.cellSize)));
    //     army.addedUnits.add(unit);
        
    //     $("#addUnitMenu").css({
    //         "visibility":"hidden",
    //         "opacity":0,
    //         "transition-delay":"visibility 0s linear 0.1s, opacity 0.2s linear"
    //     });
    // });
    
    $("body").on("click", ".units", function () {
        let unit = army.ui.units[this.id]();
                
        army.field.addUnit(unit, army.field.convertToIndex(parseInt(army.clickedX / army.field.cellSize), parseInt(army.clickedY / army.field.cellSize)));
        army.addedUnits.add(unit);
        
        $("#addUnitMenu").css({
            "visibility":"hidden",
            "opacity":0,
            "transition-delay":"visibility 0s linear 0.1s, opacity 0.2s linear"
        });
    });  
});
