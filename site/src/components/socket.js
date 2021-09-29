window.socket = io.connect('https://sphere.smart09codes.repl.co' || window.location.href, {reconnect: false});
const noticeEl = document.getElementById('notice');
noticeEl.dataset.active = "true";

socket.on('person', (stuff) => {
	noticeEl.innerHTML = 'People: ' + stuff.toString();
});

socket.on("connect_error", (err) => {
  	console.log(`connect_error due to ${err.message}`);
});

document.getElementById('join').onclick = function () {
	const color = document.getElementById('color').value;
	socket.emit('init', color);
	document.querySelector('#start-panel').style.top = (-window.innerHeight - 100).toString() + 'px';

}

window.lastPingTime = 0

setInterval(() => {
	lastPingTime = performance.now();
	socket.emit('ping');
}, 500);

socket.on('pong', () => {
	document.getElementById('ping').innerHTML = 'ping: '(performance.now() - lastPingTime).toString() + 'ms'; 
	alert(document.getElementById('ping').innerHTML);
});