import * as THREE from '../../three/three.module.js';
import Cube from './cube.js';
import Player from './player.js';
import Controls from '../tools/controls.js';
import Floor from './floor.js';
import * as CANNON from '../../cannon/cannon-es.js';
import Stats from '../../stats.js';
import Ball from './ball.js';

class World {
	constructor() {
		this.math = THREE.MathUtils;

		this.createPhysics();

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

		this.camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
		this.cameraHolder = new THREE.Object3D();
		this.camera.position.set(0, 0, Math.min(window.innerWidth, window.innerHeight) / 50);
		this.cameraHolder.add(this.camera);


		this.lights = [new THREE.DirectionalLight('white', 8)/*, new THREE.AmbientLight('white', 1)*/];
		this.lights[0].position.set(10, 10, 10);
		this.lights[0].castShadow = true;
		this.lights.forEach(function (light) {
			this.scene.add(light);
		}.bind(this));

		this.floor = new Floor(this.physmaterial, 30, 30, 'yellow');
		this.scene.add(this.floor);
		this.world.addBody(this.floor.body);


		this.resize();
		window.addEventListener('resize', this.resize.bind(this));

		this.cubes = [];
		//this.cubes.push(new Cube());

		for (let cube of this.cubes) {
			cube.add(this.scene);
		}

		this.player = new Player(this.physmaterial);
		this.scene.add(this.player);
		this.scene.add(this.cameraHolder);
		this.world.addBody(this.player.body);

		const numBalls = 2;
		this.balls = []

		for (let i = 0; i < numBalls; i++) {
			const ball = new Ball();
			this.world.addBody(ball.body);
			this.scene.add(ball);
			this.balls.push(ball);
		}
		

		this.onViewChange(0, 40);

		//this.rotater = new PointerLockHandler(this.renderer.domElement, this.camera, this.onViewChange.bind(this), this.cameraHolder);

		this.createControls();

		this.test();

		this.isGoing = false;

		this.stats = new Stats();

		this.container.appendChild(this.stats.domElement);
		this.stats.domElement.style.cssText = 'top:0;left:0;position:absolute;z-index:100';

		this.start();

		// done loading
		document.querySelector('.load-cover').style.display = 'none';
	}

	resize() {
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
	}


	test() {
		const geometry = new THREE.SphereGeometry(1, 32, 16);
		const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
		this.sphere = new THREE.Mesh(geometry, material);
		this.sphere.position.x = 2;
		this.scene.add(this.sphere);
		this.scene.add(new THREE.GridHelper(30, 30));
	}

	onViewChange(dX, dY) {
		const slowAmount = 100
		this.player.body.quaternion.setFromAxisAngle(this.player.axis, this.player.rotationX - dX / slowAmount);
		this.player.rotationX -= dX / slowAmount;
		this.cameraHolder.rotation.y -= this.math.degToRad(dX);
		this.cameraHolder.rotation.x -= this.math.degToRad(dY);
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
		// Physics

		const time = performance.now() / 1000;
		if (!this.lastCallTime) {
			this.world.step(this.timeStep);
		} else {
			const dt = time - this.lastCallTime;
			this.world.step(this.timeStep, dt);
		}
		this.lastCallTime = time;

		// Rendering

		this.player.update();
		this.cameraHolder.position.copy(this.player.position);
		this.stats.update();
		this.balls.forEach(x=>x.update());
		this.renderer.render(this.scene, this.camera);
	}

	start() {
		this.renderer.setAnimationLoop(this.update.bind(this));
		this.isGoing = true;
	}
	stop() {
		this.renderer.setAnimationLoop(null);
		this.isGoing = false;
	}
	createPhysics() {
		this.world = new CANNON.World({
			gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
		});

		this.lastCallTime = 0;

		this.timeStep = 1 / 60;

		const physicsMaterial = new CANNON.Material('physics')
		const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
			friction: 0.0,
			restitution: 0.3,
		})

		// We must add the contact materials to the world
		this.world.addContactMaterial(physics_physics);

		this.physmaterial = physics_physics;
	}
}

export default World;