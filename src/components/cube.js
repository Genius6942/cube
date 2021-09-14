import {
	Color,
	TextureLoader,
	BoxBufferGeometry,
	Mesh,
	MeshStandardMaterial,
} from '/three/three.module.js';

class Cube {
	constructor (options) {
		this.options = options || {};
		
		this.geometry = new BoxBufferGeometry(this.options.size || 2, this.options.size || 2, this.options.size || 2);

		this.material = new MeshStandardMaterial({color: 'red'});

		this.object = new Mesh(this.geometry, this.material);

		this.object.rotation.set(.5, .2, .8);

	}
	add (object) {
		object.add(this.object);
	}
}

export default Cube;