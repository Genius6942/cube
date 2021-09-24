import {
	BoxBufferGeometry,
	MeshStandardMaterial,
	Mesh
} from '../../three/three.module.js';
import {
	Box,
	Vec3,
	Body
} from '../../cannon/cannon-es.js';

class Floor extends Mesh {
	constructor (width, height, contactMaterial, color = 'white') {
		super();
		this.reciveShadow = true;
		this.material = new MeshStandardMaterial({color: color});
		this.geometry = new BoxBufferGeometry(width, .5, height);

		this.body = new Body({ mass: 0, shape: new Box(new Vec3(width, .5, height)), material: contactMaterial });
		this.body.position.set(0, -.5, 0);
		this.position.y = this.body.position.y + .25;
	}
}

export default Floor;