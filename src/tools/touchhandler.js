import JoyStick from './joystick.js';

class TouchHandler {
	constructor (element, onRotate) {
		this.onRotate = onRotate;
		
		this.element = element;

		this.location = [0,0];

		this.touchnum = 0;

		this.element.addEventListener('touchstart', this.start.bind(this));
		this.element.addEventListener('touchmove', this.move.bind(this));
		this.element.addEventListener('touchend', this.end.bind(this));
	}

	start (e) {
		e.preventDefault();
		this.touchnum = 1;
		this.location = [parseInt(e.changedTouches[0].clientX), parseInt(e.changedTouches[0].clientY)];
	}
	move (e) {
		e.preventDefault();
		this.onRotate((this.location[0] - parseInt(e.changedTouches[0].clientX)) * - 1, (this.location[1] - parseInt(e.changedTouches[0].clientY)) * -1);
		this.location = [parseInt(e.changedTouches[0].clientX), parseInt(e.changedTouches[0].clientY)];
	}
	end (e) {
		this.touchnum = 0;
	}
}

export default TouchHandler;