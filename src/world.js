import * as THREE from '/three/three.module.js';
import Cube from './cube.js';
import Player from './player.js';
import Controls from '../tools/controls.js';
import Floor from './floor.js';

class World {
	constructor() {
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

		this.camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
		this.cameraHolder = new THREE.Object3D();
		this.camera.position.set(0, 0, 10);
		this.cameraHolder.add(this.camera);


		this.lights = [new THREE.DirectionalLight('white', 8)/*, new THREE.AmbientLight('white', 1)*/];
		this.lights[0].position.set(10, 10, 10);
		this.lights[0].castShadow = true;
		this.lights.forEach(function (light) {
			this.scene.add(light);
		}.bind(this));

		this.floor = new Floor(30, 30, 'yellow');
		this.scene.add(this.floor);


		this.resize();
		window.addEventListener('resize', this.resize.bind(this));

		this.cubes = [];
		//this.cubes.push(new Cube());

		for (let cube of this.cubes) {
			cube.add(this.scene);
		}

		this.player = new Player();
		this.scene.add(this.player);
		this.player.add(this.cameraHolder);
		this.player.position.y += .35;

		//this.rotater = new PointerLockHandler(this.renderer.domElement, this.camera, this.onViewChange.bind(this), this.cameraHolder);

		this.createControls();

		this.test();

		this.isGoing = false;

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
		this.scene.add(new THREE.GridHelper(30, 30))
	}

	onViewChange(dX, dY) {
		this.player.rotation.y -= this.math.degToRad(dX);
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
		this.player.update();
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
}

export default World;