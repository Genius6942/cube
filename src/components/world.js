import * as THREE from '../../three/three.module.js';
import * as CANNON from '../../cannon/cannon-es.js';
import Cube from './cube.js';
import Player from './player.js';
import Controls from '../tools/controls.js';
import Floor from './floor.js';
import Stats from './stats.js'; // stats.js by mrdoob
import Camera from './camera.js';
import Ball from './ball.js';

class World {
	constructor() {
		this.initPhysics();

		this.math = THREE.MathUtils;

		this.container = document.getElementById('container');
		this.container.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0;';
		document.body.appendChild(this.container);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.physicallyCorrectLights = true;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.container.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color('white');

		this.camera = new Camera();
		this.cameraHolder = new THREE.Object3D();
		this.camera.camera.position.set(0, 0, 10);
		this.cameraHolder.add(this.camera.camera);
		this.cameraHolderX = new THREE.Object3D();
		this.cameraHolderX.add(this.cameraHolder);
		this.scene.add(this.cameraHolderX);

		this.stats = new Stats();
		this.container.appendChild(this.stats.domElement);
		this.stats.domElement.style.cssText = `
			top: 0;
			left: 0;
			position: absolute;
			z-index: 98;
		`;


		this.lights = [new THREE.DirectionalLight('white', 8)/*, new THREE.AmbientLight('white', 1)*/];
		this.lights[0].position.set(10, 10, 10);
		this.lights[0].castShadow = true;
		let light = this.lights[0];

		light.shadow.camera.near = 10
		light.shadow.camera.far = 100
		light.shadow.camera.fov = 30

		// light.shadow.bias = -0.0001
		light.shadow.mapSize.width = 2048
		light.shadow.mapSize.height = 2048
		this.lights.forEach(function (light) {
			this.scene.add(light);
		}.bind(this));

		this.floor = new Floor(30, 30, this.contactMaterial, 'yellow');
		this.scene.add(this.floor);
		this.world.addBody(this.floor.body);


		this.resize();
		window.addEventListener('resize', this.resize.bind(this));

		this.cubes = [];
		//this.cubes.push(new Cube());

		for (let cube of this.cubes) {
			cube.add(this.scene);
		}

		this.player = new Player();
		this.scene.add(this.player);
		this.player.position.y += .35;
		this.world.addBody(this.player.body);

		//this.rotater = new PointerLockHandler(this.renderer.domElement, this.camera, this.onViewChange.bind(this), this.cameraHolder);

		this.createControls();

		this.test();

		this.isGoing = false;

		this.onViewChange(40, 20);

		this.start();

		// done loading
		document.querySelector('.load-cover').style.display = 'none';
	}

	resize() {
		this.camera.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.camera.updateProjectionMatrix();

		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
	}


	test() {
		/*
		const geometry = new THREE.SphereGeometry(1, 32, 16);
		const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
		this.sphere = new THREE.Mesh(geometry, material);
		this.sphere.position.set(0,2,0);
		this.scene.add(this.sphere);
		this.sphere.castShadow = true;
		this.sphere.reciveShadow = true;
		this.sphere.body = new CANNON.Body({mass: .1, material: this.createContactMaterial(.3, 1), shape: new CANNON.Sphere(1)});
		this.world.addBody(this.sphere.body);
		this.sphere.body.position.set(4, 5, 0);
		this.sphere.update = function () {
			if (this.body.position.y < -50) {
				this.body.position.set( 4, 5, 0 );
				this.body.velocity.set(0, 0, 0);
			}
			this.position.copy (this.body.position);
			this.quaternion.copy(this.body.quaternion);
		}.bind(this.sphere);
		this.sphere.body.velocity.x = -1;
		*/

		this.gridHelper = new THREE.GridHelper(100, 100);
		this.scene.add(this.gridHelper);

		const ballnum = 4;
		this.balls = [];
		for (let i = 0; i < ballnum; i++) {
			const ball = new Ball();
			this.scene.add(ball);
			this.world.addBody(ball.body);
			this.balls.push(ball);
		}
	}

	onViewChange(dX, dY) {
		this.player.rotation.y -= this.math.degToRad(dX);
		this.cameraHolder.rotation.x -= this.math.degToRad(dY);
		this.cameraHolderX.rotation.y -= this.math.degToRad(dX);
		this.cameraHolder.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraHolder.rotation.x))
	}

	onAngleChange(angle) {
		if (angle === false) {
			this.player.moving = false;
			this.player.angle = 0;
		}
		else {
			this.player.angle = angle;
			this.player.moving = true;
		}
	}

	createControls() {
		this.controls = new Controls(this.renderer.domElement, this, this.onViewChange.bind(this), this.onAngleChange.bind(this));
	}

	update() {
		this.player.update(this.cameraHolderX.rotation.y, this.cameraHolder.rotation.x);
		this.balls.forEach((x) => x.update());
		this.updatePhysics();
		this.cameraHolderX.position.copy(this.player.position);
		this.renderer.render(this.scene, this.camera.camera);
		this.stats.update();
	}

	start() {
		this.renderer.setAnimationLoop(this.update.bind(this));
		this.isGoing = true;
	}
	stop() {
		this.renderer.setAnimationLoop(null);
		this.isGoing = false;
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

		//test

		//setInterval(() => world.onViewChange(.1, 0), 2);
	}

	updatePhysics() {
		const time = performance.now();
		this.world.step(this.timeStep, time - this.lastCallTime);
		this.lastCallTime = time;
	}
}

export default World;