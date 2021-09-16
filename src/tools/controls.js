import PointerLockHandler from './pointerlock.js';
import TouchHandler from './touchhandler.js';
import { MathUtils } from '/three/three.module.js';

class Controls {
	constructor (element, world, onViewChange = () => {}, onAngleChange = () => {}, onlock = () => {}, onunlock = () => {}) {
		this.math = MathUtils;

		this.onAngleChange = onAngleChange;
		this.onViewChange = onViewChange;
		this.canvasElement = element;

		this.world = world;

		this.rotation = 0;
		this.moveAngle = 0;
		
		this.touchHandler = new TouchHandler(this.canvasElement, this.viewChange.bind(this));
		this.mouseHandler = new PointerLockHandler(this.canvasElement, this.viewChange.bind(this), onlock, onunlock);
	}

	viewChange (dx, dy) {
		this.rotation -= this.math.degToRad(dx);
		this.onViewChange(dx, dy);
	}

}

export default Controls;