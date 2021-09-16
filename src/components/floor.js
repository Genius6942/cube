import {
	BoxBufferGeometry,
	MeshStandardMaterial,
	Mesh
} from '/three/three.module.js';

class Floor extends Mesh {
	constructor (width, height, color = 'white') {
		super();
		this.reciveShadow = true;
		this.material = new MeshStandardMaterial({color: color});
		this.geometry = new BoxBufferGeometry(width, .5, height);
		this.translateY(-.25)
	}
}

export default Floor;