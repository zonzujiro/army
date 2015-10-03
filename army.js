"use strict"

class Army {
    constructor() {
        this.addedUnits;
        this.clickedX, this.clickedY;
        this.ui;
        this.field;
        this.addedUnits = new Set();
        this.sources = new Sources(this);
        this.ui = new UserInterface(this.sources, this);
    }
        
    init() {
        this.field = new Field(this.ui, this.ui.map.mountain);
    }
};

