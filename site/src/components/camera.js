import {
	PerspectiveCamera,
} from '../../three/three.module.js';

class Camera {
	constructor() {
		this.camera = new PerspectiveCamera(35, 1, 0.1, 100);
	}
}

export default Camera;