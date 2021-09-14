import * as THREE from '/three/three.module.js';
import Cube from './cube.js';
import Player from './player.js';
import PointerLockHandler from '../tools/pointerlock.js';

class World {
	constructor() {
		console.log('yay');
		this.container = document.createElement('div');
		this.container.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0;';
		document.body.appendChild(this.container);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.physicallyCorrectLights = true;
		this.container.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color('white');

		this.camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
		this.cameraHolder = new THREE.Object3D();
		this.camera.position.set(0, 0, 10);
		this.cameraHolder.add(this.camera);


		this.lights = [new THREE.DirectionalLight('white', 8), new THREE.AmbientLight('white', 1)];
		this.lights[0].position.set(10, 10, 10);
		for (let light of this.lights) {
			this.scene.add(light)
		}


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
		console.log(this.player.geometry);
		this.player.position.z

		this.rotater = new PointerLockHandler(this.renderer.domElement, this.camera, this.onViewChange.bind(this), this.cameraHolder);

		this.test();

		this.render();

		// done loading
		document.querySelector('.load-cover').style.display = 'none';
	}

	resize() {
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.render();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	test() {
		const geometry = new THREE.SphereGeometry(1, 32, 16);
		const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
		this.sphere = new THREE.Mesh(geometry, material);
		this.sphere.position.x = 2;
		this.scene.add(this.sphere);
		this.scene.add(new THREE.GridHelper(10,10))
	}

	onViewChange (dX, dY) {
		this.player.rotation.y += dX / -30;
		this.cameraHolder.rotation.x += dY / -30;
		this.render();
	}
}

export default World;