import {
	BoxBufferGeometry,
	SphereBufferGeometry,
	MeshStandardMaterial,
	Mesh,
	Object3D,
	TextureLoader,
	Quaternion,
	Vector3,
	Euler,
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

		this.moving = false;

		this.initPhysics();

		document.addEventListener('keydown', function (e) {
			if (!e.repeat && e.key == ' ') {
				this.jump();
			}
		}.bind(this));
	}

	update(rX, rY) {
		this.inputVelocity.set(0, 0, 0);

		this.euler.x = rY;
		this.euler.y = rX;
		this.euler.order = 'XYZ';
		this.quaternion.setFromEuler(this.euler);

		if (this.moving) {
			this.move(this.rotation.y + this.angle, this.speed);
		}

		this.position.copy(this.body.position);
		this.quaternion.copy(this.body.quaternion);
		this.position.y += .35;
		//console.log(this.body.position.x, this.body.position.z);
	}

	jump () {
		if (this.canJump) {
			this.body.velocity.y = this.jumpSpeed;
		}
	}

	move(angle, speed) {
		this.inputVelocity.z -= speed * Math.cos(angle);
		this.inputVelocity.x -= speed * Math.sin(angle);

		this.inputVelocity.applyQuaternion(this.qn);

		this.body.velocity.z = this.inputVelocity.z;
		this.body.velocity.x = this.inputVelocity.x;

		console.log(this.body.position.x, this.body.position.z, this.body.position.y);
	}

	initPhysics() {
		this.body = new Body(5, new Sphere(.35));

		this.body.position.set(0, 5, 0);

		this.contactNormal = new Vec3();
		this.upAxis = new Vec3(0, 1, 0);
		this.inputVelocity = new Vector3();
		this.euler = new Euler();

		this.speed = .1;
		this.oSpeed = this.speed;
		this.jumpSpeed = 5;

		this.qn = new Quaternion();

		this.velocity = this.body.velocity;

		this.body.addEventListener('collide', (event) => {
			const { contact } = event;

			// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
			// We do not yet know which one is which! Let's check.
			if (contact.bi.id === this.body.id) {
				// bi is the player body, flip the contact normal
				contact.ni.negate(this.contactNormal)
			} else {
				// bi is something else. Keep the normal as it is
				this.contactNormal.copy(contact.ni);
			}

			// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
			if (this.contactNormal.dot(this.upAxis) > 0.5) {
				// Use a "good" threshold value between 0 and 1 here!
				this.canJump = true;
			}
		});

		this.canJump = false;
	}
}

export default Player;