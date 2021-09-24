import {
	BoxBufferGeometry,
	SphereBufferGeometry,
	MeshStandardMaterial,
	Mesh,
	Object3D,
	TextureLoader,
	Quaternion,
} from '../../three/three.module.js';
import {
	Sphere,
	Vec3,
	Body,
} from '../../cannon/cannon-es.js';

class Player extends Object3D {
	constructor() {
		super();

		this.textureLoader = new TextureLoader();

		this.boxGeometry = new BoxBufferGeometry(.7, .7, .7);
		this.sphereGeometry = new SphereBufferGeometry(.35, 64, 32);
		this.THREEMaterial = new MeshStandardMaterial({ color: 'brown' })
		this.mesh = new Mesh(this.sphereGeometry, this.THREEMaterial);
		this.texture = this.textureLoader.load(
			'/assets/wood.png',
			
			function (texture) {
				this.THREEMaterial.map = texture;
				this.THREEMaterial.color = undefined;
				this.THREEMaterial.needsUpdate = true;
			}.bind(this),

			undefined,

			function (err) {
				console.warn('Error loading texure "/assets/wood.png": using brown color');
			}

		);
		this.mesh.castShadow = true;
		this.mesh.reciveShadow = true;

		this.add(this.mesh);
		
		this.angle = 0;

		this.speed = .1;
		this.oSpeed = this.speed;

		this.moving = false;

		this.initPhysics();
	}

	update () {
		if (this.moving) {
			this.move(this.rotation.y + this.angle, this.speed);
		}
	}

	move (angle, speed) {
		this.position.z -= speed * Math.cos(angle);
		this.position.x -= speed * Math.sin(angle);
	}

	initPhysics () {
		
	}
}

export default Player;