import {
	SphereBufferGeometry,
	Mesh,
	MeshStandardMaterial,
} from '../../three/three.module.js';
import {
	Sphere,
	Body,
	Vec3,
} from '../../cannon/cannon-es.js';

class Ball extends Mesh {
	constructor(radius = 1, color = Math.floor(Math.random() * 16777215)) {
		super();
		this.material = new MeshStandardMaterial({ color: color });
		this.geometry = new SphereBufferGeometry(radius, 32 * radius, 16 * radius);

		this.body = new Body({ mass: radius * .1, shape: new Sphere(radius) });
		this.origin = new Vec3(Math.random() * 10 - 5, Math.random() * 3 + 4, Math.random() * 10 - 5);
		this.body.position.set(this.origin.x, this.origin.y, this.origin.z);
	}

	update() {
		if (this.body.position.y < -50) {
			this.body.position.set(this.origin.x, this.origin.y, this.origin.z);
			this.body.velocity.set(0, 0, 0);
		}
		this.position.copy(this.body.position);
		this.quaternion.copy(this.body.quaternion);
	}
}

export default Ball;