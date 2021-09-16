import PointerLockHandler from './pointerlock.js';
import TouchHandler from './touchhandler.js';
import { MathUtils } from '/three/three.module.js';
import JoyStick from './joystick.js';

class Controls {
	constructor (element, world, onViewChange = () => {}, onAngleChange = () => {}, onlock = () => {}, onunlock = () => {}) {
		this.math = MathUtils;
		
		this.isMobile = window.isMobile = window.checkMobile();

		this.onAngleChange = onAngleChange;
		this.onViewChange = onViewChange;
		this.canvasElement = element;

		this.world = world;

		this.rotation = 0;
		this.moveAngle = 0;
		
		this.touchHandler = new TouchHandler(this.canvasElement, this.viewChange.bind(this));
		this.mouseHandler = new PointerLockHandler(this.canvasElement, this.viewChange.bind(this), onlock, onunlock);
		if (this.isMobile || true) {
			this.joy = window.joy = new JoyStick(document.getElementById('container'), this.angleChange.bind(this));
		}
	}

	viewChange (dx, dy) {
		this.rotation -= this.math.degToRad(dx);
		this.onViewChange(dx, dy);
	}
	angleChange (angle) {
		this.onAngleChange(angle);
	}

}

export default Controls;