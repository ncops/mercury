const config = {
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASS
	},
	ui: {
		public_port: 3000,
		socket_io_port: 3001
	}
};

var express = require('express');
var app = express();
var path = require('path');
var redis = require("redis"),

client = redis.createClient(config.redis);

var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	index: false,
	maxAge: '1d',
	redirect: false,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}
};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/reset', function(req, res){

});

app.get('/setJobs/:count', function(req, res){
	console.log(req.params.count);
	client.del('jobs', (err, data) => {
		console.log(err, data);
        client.sadd('jobs', ...Array(parseInt(req.params.count)).keys(), (err, data) => {
            res.send("OK", err, data);
        });
	});

});

const socketio = require('http').createServer();

const io = require('socket.io')(socketio);
let healthCheck;

const queueCheck = () => {
	if(io.engine.clientsCount > 0){
		let jobsCount;
		let connectedClients;
		let date = new Date().toLocaleString();
		let time = date.split(' ')[1];
		clearTimeout(healthCheck);

		client.multi()
		.scard("jobs")
		.info("clients")
		.exec(function (err, replies) {
			jobsCount = replies[0];
			connectedClients = replies[1].split('\n');
			connectedClients = connectedClients[1].replace('\r', '').split(':')[1] - 1;
	
			io.sockets.emit('queueCheck', {jobs: jobsCount, workers: connectedClients, time: time});

			healthCheck = setTimeout(queueCheck, 1500);
		});


	} else {
		clearTimeout(healthCheck);
	}
}

socketio.on('connection', (socket) => {
	queueCheck();
});

socketio.listen(config.ui.socket_io_port);
app.listen(config.ui.public_port);