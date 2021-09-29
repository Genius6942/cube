const express = require('express');

const app = express();
app.use(express.static(__dirname + '/site'));

const server = app.listen(3000, () => {
	console.log('server started');
});

const io = require('socket.io')(server, {
	cors: {
		origin: ['https://sphere.smart09codes.repl.co', 'https://cube.smart09codes.repl.co']
	}
});

let numOfPeople = 0;
global.world = new require('./src/components/world.js');

io.on('connection', (socket) => {
	numOfPeople += 1;
	io.emit('person', numOfPeople);
	
	socket.on('disconnect', () => {
		numOfPeople -= 1;
		io.emit('person', numOfPeople);
	});

	socket.on('init', (color) => {
		console.log('new player joined with color ' + color);
		io.to(socket.id).emit(global.world.getInfo());
	});

	socket.on('ping', () => {
		io.to(socket.id).emit('pong');
		console.log('pingpong');
	})
});
globals.fps = 45;
setInterval(() => io.emit('main', world.getInfo()), 1000 / globals.fps);
