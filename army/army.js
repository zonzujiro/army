"use strict"

class Army {
    constructor() {
        this.addedUnits;
        this.clickedX, this.clickedY;
        this.ui;
        this.field;
        this.addedUnits = new Set();
        this.sources = new Sources(this);
        this.factory = new Factory(this.sources);
        this.ui = new UserInterface(this.factory, this);
    }

    init() {
        this.field = new Field(this.ui, this.factory.map.mountain, this.factory);
    }
};