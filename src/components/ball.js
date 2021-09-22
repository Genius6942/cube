import {
	Vec3,
	Sphere,
	Body,
} from '../../cannon/cannon-es.js';
import {
	Mesh,
	SphereBufferGeometry,
	MeshStandardMaterial,
} from '../../three/three.module.js';

class Ball extends Mesh {
	constructor (radius = 2, color = 0xff0000) {
		super();
		this.material = new MeshStandardMaterial({color: color});
		this.geometry = new SphereBufferGeometry(radius, 32, 16);
		this.reciveShadow = true;
		this.castShadow = true;

		this.body = new Body({mass: 2, shape: new Sphere(radius)});
		this.body.position.set(2,10,2)
		
		//this.body.position.set((Math.floor(Math.random * 10) + 1) - 5, Math.floor(Math.random*10) + 1, (Math.floor(Math.random * 10) + 1) - 5);
	}
	
	update () {
		this.position.set(this.body.position);
		if (this.body.position.y < -30) {
			this.body.position.set(2,10,2);
		}
	}
}

export default Ball;