const express = require('express');

const app = express();
app.use(express.static(__dirname + '/site'));

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});


app.listen(3000, () => {
	console.log('server started');
});