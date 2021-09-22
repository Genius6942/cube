import {
	SphereBufferGeometry,
	BoxBufferGeometry,
	MeshStandardMaterial,
	Mesh,
	Object3D,
	Quaternion,
} from '../../three/three.module.js';
import {
	Vec3,
	Sphere,
	Box,
	Body,
} from '../../cannon/cannon-es.js';
import { GLTFLoader } from '../../three/GLTFLoader.js';

class Player extends Object3D {
	constructor(material) {
		super();
		this.mesh = new Mesh(/*new BoxBufferGeometry(.7, .7, .7)*/ new SphereBufferGeometry(.35, 32, 16), new MeshStandardMaterial({ color: 'blue' }));
		this.body = new Body({ mass: 1, shape: /*new Box(new Vec3(.35, .35, .35))*/ new Sphere(.35), material: material});
		this.castShadow = true;
		this.body.castShadow = true;

		this.add(this.mesh);

		this.angle = 0;

		this.canJump = true;
		this.jumpVelocity = 7;

		this.speed = 5;
		this.oSpeed = this.speed;

		this.moving = false;

		this.loader = new GLTFLoader();

		this.contactNormal = new Vec3() // Normal in the contact, pointing *out* of whatever the player touched
    	this.upAxis = new Vec3(0, 1, 0);

		this.body.addEventListener('collide', (event) => {
			const { contact } = event

			// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
			// We do not yet know which one is which! Let's check.
			if (contact.bi.id === this.body.id) {
				// bi is the player body, flip the contact normal
				contact.ni.negate(this.contactNormal)
			} else {
				// bi is something else. Keep the normal as it is
				this.contactNormal.copy(contact.ni)
			}

			// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
			if (this.contactNormal.dot(this.upAxis) > 0.5) {
				// Use a "good" threshold value between 0 and 1 here!
				this.canJump = true;
			}			
		});
		this.velocity = this.body.velocity;

		window.addEventListener('keydown', function (e) {
			if (e.key == ' ' && this.canJump) {
				this.canJump = false;
				this.body.velocity.y = this.jumpVelocity;
			}
		}.bind(this));

		//this.body.position.set(0, .35, 0);

		this.axis = new Vec3(0, 1, 0);
		
		this.rotationX = 0;
		
		this.reset();

	}

	reset () {
		this.body.position.set(0, 10, 0);
	}

	async load() {
		await loader.load('/src/assets/player.glb');
	}/*
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
	}*/

	update() {
		if (this.moving) {
			this.move(this.rotation.y + this.angle, this.speed);
		}
		if (this.position.y < -50) {
			this.reset();
		}
		this.quaternion.copy(this.body.quaternion);
		this.position.copy(this.body.position);
	}

	move(angle, speed) {
		this.body.velocity.z = -speed * Math.cos(angle);
		this.body.velocity.x = -speed * Math.sin(angle);
		/*
		this.position.z -= speed * Math.cos(angle);
		this.position.x -= speed * Math.sin(angle);
		*/
	}
}

export default Player;