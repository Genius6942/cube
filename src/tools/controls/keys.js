class KeyHandler {
	constructor(element, onKeyChange = () => { }) {
		this.element = element;
		this.onKeyChange = onKeyChange;

		this.keys = { jumping: false, canjump: true, spaceDown: false, up: false, left: false, down: false, right: false }

		this.angle = false;

		this.pi = Math.PI;

		window.addEventListener('keydown', this.onKeyDown.bind(this));
		window.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	onKeyDown(e) {
		if (e.repeat) return;
		switch (e.key) {
			case "ArrowLeft":
				this.keys.left = true;
				break;
			case "ArrowRight":
				this.keys.right = true;
				break;
			case "ArrowUp":
				this.keys.up = true;
				break;
			case "ArrowDown":
				this.keys.down = true;
				break;
			case "a":
				this.keys.left = true;
				break;
			case "d":
				this.keys.right = true;
				break;
			case "w":
				this.keys.up = true;
				break;
			case "s":
				this.keys.down = true;
				break;
		}

		this.calculateAngle();
	}

	onKeyUp(e) {
		if (e.repeat) return;
		switch (e.key) {
			case "ArrowLeft":
				this.keys.left = false;
				break;
			case "ArrowRight":
				this.keys.right = false;
				break;
			case "ArrowUp":
				this.keys.up = false;
				break;
			case "ArrowDown":
				this.keys.down = false;
				break;
			case "a":
				this.keys.left = false;
				break;
			case "d":
				this.keys.right = false;
				break;
			case "w":
				this.keys.up = false;
				break;
			case "s":
				this.keys.down = false;
				break;
		}

		this.calculateAngle();
	}

	calculateAngle() {
		if (this.keys.up && this.keys.left && this.keys.down && this.keys.right) {
			this.angle = false;
		}
		else if (this.keys.left && this.keys.right) {
			if (this.keys.up) {
				this.angle = 0;
			} else if (this.keys.down) {
				this.angle = this.pi;
			} else {
				this.angle = false;
			}
		} else if (this.keys.up && this.keys.down) {
			if (this.keys.left) {
				this.angle = this.pi / 2;
			} else if (this.keys.right) {
				this.angle = this.pi * 1.5;
			} else {
				this.angle = false;
			}
		} else if (this.keys.right) {
			this.angle = this.pi * 1.5;
		} else if (this.keys.left) {
			this.angle = this.pi / 2;
		} else if (this.keys.down) {
			this.angle = this.pi;
		} else if (this.keys.up) {
			this.angle = 0;
		} else {
			this.angle = false;
		}
		this.onKeyChange(this.angle);
	}
}

export default KeyHandler;