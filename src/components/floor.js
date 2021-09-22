import {
	BoxBufferGeometry,
	MeshStandardMaterial,
	Mesh
} from '../../three/three.module.js';
import {
	Box,
	Vec3,
	Body,
} from '../../cannon/cannon-es.js';

class Floor extends Mesh {
	constructor (material, width, height, color = 'white') {
		super();
		this.reciveShadow = true;
		this.material = new MeshStandardMaterial({color: color});
		this.geometry = new BoxBufferGeometry(width, .5, height);
		this.translateY(-.25);
		
		this.body = new Body({mass: 0, shape: new Box(new Vec3(width / 2, .5, height / 2))});
		this.body.position.set(0, -.5, 0);
	}
}

export default Floor;