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
	constructor(material) {
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

		this.realAngle = 0;

		this.moving = false;

		this.initPhysics(material);

		document.addEventListener('keydown', function (e) {
			if (!e.repeat && e.key == ' ') {
				this.jump();
			}
		}.bind(this));
	}

	set angle(value) {
		this.realAngle = value < 0 ? Math.PI * 2 + value : value;
	}

	update(rX, rY) {
		// document.getElementById('notice').innerHTML = `x : ${Math.round(rX * 10) / 10}, y : ${Math.round(rY * 10000) / 10000}`;
		this.inputVelocity.set(0, 0, 0);

		this.euler.x = rY;
		this.euler.y = rX;
		this.euler.order = 'XYZ';
		this.quaternion.setFromEuler(this.euler);

		if (this.moving) {
			this.move(rX + this.realAngle, this.speed);
		} else {
			this.velocity.x = 0;
			this.velocity.z = 0;
		}

		if (this.position.y < this.resetHeight) {
			this.reset();
		}
		this.position.copy(this.body.position);
		this.quaternion.copy(this.body.quaternion);
	}

	reset() {
		this.body.velocity.set(0, 0, 0);
		this.body.position.set(0, 5, 0);
	}

	jump() {
		if (this.canJump) {
			this.body.velocity.y = this.jumpSpeed;
		}
		this.canJump = false;
	}

	move(angle, speed) {
		this.inputVelocity.z -= speed * Math.cos(angle);
		this.inputVelocity.x -= speed * Math.sin(angle);

		this.inputVelocity.applyQuaternion(this.qn);

		this.body.velocity.z = this.inputVelocity.z;
		this.body.velocity.x = this.inputVelocity.x;
	}

	initPhysics(material) {
		this.resetHeight = -30;

		this.body = new Body({ mass: 5, shape: new Sphere(.35), material: material });

		this.body.position.set(0, 5, 0);

		this.contactNormal = new Vec3();
		this.upAxis = new Vec3(0, 1, 0);
		this.inputVelocity = new Vector3();
		this.euler = new Euler();

		this.speed = .7;
		this.oSpeed = this.speed;
		this.jumpSpeed = 3;

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