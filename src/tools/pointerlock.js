import TouchHandler from './touchhandler.js';
import { Object3D } from '/three/three.module.js';

class PointerLockHandler {
	constructor(element, camera, onRotate = () => {}, center = new Object3D(), unlock = () => false, lock = () => false) {
		this.isMobile = window.isMobile = window.checkMobile();
		this.element = element;

		this.camera = camera;
		this.element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock;

		this.center = center;

		this.onRotate = onRotate;

		this.cameraDistance = this.camera.position.distanceTo(this.center.position);

		this.unlock = unlock; this.lock = lock;

		this.mouseCoordinates = [0,0];

		document.addEventListener('pointerlockchange', function (e) {
			if (document.pointerLockElement != this.element) {
				this.element.removeEventListener('mousemove', this.mouseMove);
				this.unlock();
			}
		}.bind(this));
		window.addEventListener('keydown', function (e) {
			if (e.keyCode == 27) {
				if (document.pointerLockElement != this.element) {
					this.element.removeEventListener('mousemove', this.mouseMove);
					this.unlock();
				}
			}
		}.bind(this));

		this.element.addEventListener('mousedown', this.startLock.bind(this), true);
	}

	startLock(e) {
		this.element.requestPointerLock();
		this.element.addEventListener('mousemove', this.mouseMove.bind(this), true);
		this.lock();
		this.mouseCoordinates = [e.clientX, e.clientY];
		console.log(this.onRotate.toString());
	}
	mouseMove(e) {
		if (document.pointerLockElement != this.element) {
			this.element.removeEventListener('mousemove', this.mouseMove);
			this.unlock();
			return;
		}

		let dX = this.mouseCoordinates[0] - e.clientX;
		let dY = this.mouseCoordinates[1] - e.clientY;

		this.onRotate(e.movementX, e.movementY);

		// Reset
		this.mouseCoordinates = [e.clientX, e.clientY];
	}
}

export default PointerLockHandler;