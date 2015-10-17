"use strict"

$(function () {
    var army = new Army();

    $("#game").addClass("clicked");
    $("#start").click(function () {
        army.addedUnits.forEach(function (unit) {
            unit.ui = army.ui;
        });

        army.ui.startGame();
    });

    $(".item").click(function () {
        army.ui.showItemMenu(this.id);
    });

    $("body").on("click", "canvas", function (clicked) {
        army.clickedX = clicked.offsetX;
        army.clickedY = clicked.offsetY;

        army.ui.showCellMenu(clicked);
    });

    $("body").on("mouseenter", ".units", function () {
        army.ui.showHoverMenu($(this).attr("class"), this.id);
    });

    $("body").on("mouseenter", ".abilities", function () {
        army.ui.showHoverMenu($(this).attr("class"), this.id);
    });

    $("body").on("mouseenter", ".spells", function () {
        army.ui.showHoverMenu($(this).attr("class"), this.id);
    });

    $("body").on("click", ".units", function () {
        var x = parseInt(army.clickedX / army.field.cellSize),
            y = parseInt(army.clickedY / army.field.cellSize);
        var index = army.field.convertToIndex(x, y);
            
        var unit = army.factory.units[this.id]();
        
        var image = army.factory.images[this.id]();
        
        image.setCoordinates(x, y);
        
        army.ui.addImageOfUnit(image);
        army.field.addUnit(unit, index);
        army.addedUnits.add(unit);

        $("#addUnitMenu").css({
            "visibility": "hidden",
            "opacity": 0,
            "transition-delay": "visibility 0s linear 0.1s, opacity 0.2s linear"
        });
    });
});