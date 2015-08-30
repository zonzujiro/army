"use strict"

$(function () {
    var ui = new UserInterface();
    var field = new Map(ui);
    var addedUnits = [];
    
    $("#info").html(ui.info.game);
    $("#game").addClass("clicked");
    
    $("#start").click(function() {        
        addedUnits.forEach(function(unit) { 
            unit.userInterface = ui; 
        });
        
        $("#start").removeClass("clicked");
        $("#list").html("");
        $("#info").addClass("inBattle");
        ui.startGame();
    });
    
    $(".item").click(function() {
        $("#info").html(ui.info[this.id]);
        $("#list").html(ui.list[this.id]);
        $("li").removeClass("clicked");
        $("#" + this.id).addClass("clicked");
        $("#addUnitMenu").css({
            "visibility":"hidden",
            "opacity":0,
            "transition-delay":"visibility 0s linear 0.1s, opacity 0.2s linear"
        });
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
        
        $("#addUnitMenu").css({
            "visibility":"hidden",
            "opacity":0,
            "transition-delay":"visibility 0s linear 0.1s, opacity 0.2s linear"
        });
    });
    
    // $("body").on("mouseleave", "#map", function () {
    //     $("#addUnitMenu").css({
    //         "visibility":"hidden",
    //         "opacity":0,
    //         "transition-delay":"visibility 0s linear 0.1s, opacity 0.2s linear"
    //     });
    // });
        
    $("body").on("click", ".cell", function(clicked) {
        $(".cell.active").removeClass("active");     
        $("#addUnitMenu").html(ui.addUnitMenu);
        $("#addUnitMenu").css("left", clicked.pageX + "px");
        $("#addUnitMenu").css("top", clicked.pageY + "px");
        $("#addUnitMenu").css({
            "visibility":"visible",
            "opacity":1,
            "transition-delay":"0s"
        });   
        $(this).addClass("active");
    });
});
