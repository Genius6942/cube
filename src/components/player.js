import {
	BoxBufferGeometry,
	MeshStandardMaterial,
	Mesh,
	Object3D,
} from '/three/three.module.js';
import { GLTFLoader } from '/three/GLTFLoader.js';

class Player extends Object3D {
	constructor() {
		super();
		this.body = new Mesh(new BoxBufferGeometry(.7, .7, .7), new MeshStandardMaterial({ color: 'blue' }));
		this.castShadow = true;
		this.body.castShadow = true;

		this.add(this.body);
		
		this.moveAngle = 0;

		this.speed = .1;
		this.oSpeed = this.speed;
		this.sSpeed = this.speed / Math.sqrt(2);

		this.loader = new GLTFLoader();
	}

	async load() {
		await loader.load('/src/assets/player.glb');
	}
	update (keys) {
		if ((keys.up || keys.down) && (keys.right || keys.left)) {
			this.speed = this.sSpeed;
		}
		if (keys.up) {
			this.move(this.rotation.y, this.speed)
		}
		if (keys.down) {
			this.move(this.rotation.y - Math.PI, this.speed);
		}
		if (keys.left) {
			this.move(this.rotation.y + Math.PI / 2, this.speed);
		}
		if (keys.right) {
			this.move(this.rotation.y - Math.PI / 2, this.speed);
		}
		this.speed = this.oSpeed;
	}

	update () {
		this.move(this.rotation.y - this.angle);
	}

	move (angle, speed) {
		this.position.z -= speed * Math.cos(angle);
		this.position.x -= speed * Math.sin(angle);
	}
}

export default Player;