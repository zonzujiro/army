"use strict"

class Sources {
	constructor() {
		this.landscape = {
			mountain: "./img/mountain.png"
		}
		
		this.units = {
			archer: "./img/archer.png"
		}
		
		this.load(this.landscape);
		this.load(this.units);
		console.log(this.landscape);
	}
	
	load(sources) {
		for (let val in sources) {
			let img = new Image();
			
			img.src = sources[val];
			sources[val] = img;
		}
	}
}
