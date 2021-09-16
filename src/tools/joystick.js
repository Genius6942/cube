class JoyStick {
	constructor(location) {
		this.container = document.createElement('div');
		this.container.style.cssText = `
			position: absolute;
			bottom: 30px;
			left: 30px;
			color: black;
		`;
		this.location = location;
		this.location.appendChild(this.container);

		this.outer = document.createElement('div');
		this.container.appendChild(this.outer);
		this.outer.style.cssText = `
			--outerSize: 200px;
			width: var(--outerSize);
			height: var(--outerSize);
			background: rgba(150, 150, 150, .6);
			border-radius: 50%;
			position: relative;
		`
		this.y = 62.5;
		this.x = 62.5;
		this.inner = document.createElement('div');
		this.outer.appendChild(this.inner);
		this.inner.style.cssText = `
			--size: 75px;
			width: var(--size);
			height: var(--size);
			position: absolute;
			bottom: ${this.x}px;
			right: ${this.x}px;
			background: rgba(100, 100, 100, .9);
			border-radius: 50%;
			transform: translate(-50%; -50%);
			border: 2px solid black;
		`

		this.movementSetup();
	}

	movementSetup() {
		this.fingers = 0;
		this.location = [0, 0]
		this.inner.addEventListener('touchstart', this.start.bind(this), true);
	}
	start(e) {
		console.log('start');
		e.preventDefault();
		this.location = [parseInt(e.changedTouches[0].clientX), parseInt(e.changedTouches[0].clientY)];
	}

	move(e) {
		let s = (v) => v.toString() + 'px';
		let u = (v) => parseInt(v.slice(0, -2));
		e.preventDefault();
		let dx = (this.location[0] - parseInt(e.changedTouches[0].clientX)) * - 1;
		let dy = (this.location[1] - parseInt(e.changedTouches[0].clientY)) * -1;
		let xno = true;
		let yno = true;
		/*
		if (this.x + dx < 0) {
			this.outer.style.left = u(this.outer.style.left) - s(-(this.x + dx))
			this.inner.style.left = u(this.inner.style.left) - s(dx + (this.x + dx));
			this.x -= dx + (this.x + dx);
			xno = false;
		}
		*/
		if (xno) {
			this.inner.style.right = s(u(this.inner.style.right) - dx);
			this.x -= dx;
		}
		if (yno) {
			this.inner.style.bottom = s(u(this.inner.style.bottom) - dy);
			this.y -= dx;
		}
		this.location[0] += dx;
		this.location[1] += dy;
	}

	end(e) {
		console.log('end');
		this.x = 62.5;
		this.y = 62.5;
		this.inner.style.left = `${this.x}px`;
		this.inner.style.top = `${this.y}px`;
		this.location = [0, 0];
	}
}



export default JoyStick;