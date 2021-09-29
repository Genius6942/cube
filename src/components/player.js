const {
	Sphere,
	Vec3,
	Body,
	Euler,
	Quaternion,
} = require('cannon-es');

module.exports = class Player {
	constructor (material, color, pid, id) {
		this.angleX = 0;
		this.angleY = 0;

		this.color = color;

		this.pid = pid;

		this.id = id;
		
		this.resetHeight = -30;

		this.body = new Body({ mass: 5, shape: new Sphere(.35), material: material });

		this.body.position.set(0, 5, 0);

		this.contactNormal = new Vec3();
		this.upAxis = new Vec3(0, 1, 0);
		this.inputVelocity = new Vec3();
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
}