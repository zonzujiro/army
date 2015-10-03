"use strict"

class Sources {
	constructor(game) {
		this.game = game;
		this.loaded = 0;
			
		this.landscape = {
			mountain: "./img/mountain.png"
		}
		
		this.units = {
			archer: "./img/archer.png",
			soldier: "./img/soldier.png"
		}
		
		this.toLoad = this.countToLoad(this.landscape) + this.countToLoad(this.units);
		
		this.load(this.landscape);
		this.load(this.units);
	}
	
	checkLoaded() {
		this.loaded += 1;
		
		if (this.loaded == this.toLoad) {
			this.game.init();
		}
	}
	
	countToLoad(obj) {
		var result = 0;
		
		for (let val in obj) {
			result += 1;
		}
		
		return result;
	}

	load(sources) {
		for (let val in sources) {
			let img = new Image();
			
			img.src = sources[val];
			sources[val] = img;
			sources[val].onload = this.checkLoaded.bind(this);
		}
	}
	
}
