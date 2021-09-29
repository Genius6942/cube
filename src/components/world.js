const CANNON = require('cannon-es');
const Player = require('./player.js');

module.exports = class World {
	constructor() {
		this.initPhysics();

		this.players = [];

		this.idIncrement = 0;

		this.objects = [];
	}

	update() {
		this.updatePhysics();
	}
	
	getInfo() {
		return [...Array(this.objects.length).keys()].map(function(x) {this.objects[x].getInfo()}.bind(this));
	}

	addPlayer(color, pid) {
		this.players.push(new Player(this.contactMaterial, color || 'red', pid, this.idIncrement));
		this.idIncrement += 1;

	}

	createContactMaterial(friction = 0, restitution = 0) {
		return new CANNON.ContactMaterial(new CANNON.Material('physics'), new CANNON.Material('physics'), {
			friction: restitution,
			restitution: restitution,
		});
	}

	initPhysics() {
		this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -1, 0) });

		this.contactMaterial = this.createContactMaterial(.5, .5);

		this.world.addContactMaterial(this.contactMaterial);

		// rendering timing

		this.timeStep = 1 / 60;

		this.lastCallTime = performance.now();
	}

	updatePhysics() {
		const time = performance.now();
		this.world.step(this.timeStep, time - this.lastCallTime);
		this.lastCallTime = time;
	}
}