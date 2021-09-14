import {
	BoxBufferGeometry,
	MeshStandardMaterial,
	Mesh,
	Object3D,
} from '/three/three.module.js';
import { GLTFLoader } from '/three/GLTFLoader.js;'

class Player extends Object3D {
	constructor () {
		super();
		this.add(new Mesh(new BoxBufferGeometry(.7, .7, .7), new MeshStandardMaterial({color: 'blue'})));

		this.loader = new GLTFLoader();
	}

	async load () {
		await loader.load('/src/assets/player.glb')
	}
}

export default Player;