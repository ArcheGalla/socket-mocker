const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const WebSocketServer = require('ws').Server;
const server = require('http').createServer();

const app = express();
const wss = new WebSocketServer({ server: server });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/test', function (req, res) {
	res.status(200).json({
		ok: "ok"
	});
});

wss.on('connection', function (ws) {
	function sendMessage () {
		let message = JSON.stringify(process.memoryUsage());

		ws.send(message, err => {
			if (err) console.log('err ', err);
		});
	}

	let id = setInterval(sendMessage, 1000);

	console.log('started client interval');

	ws.on('close', function () {
		console.log('stopping client interval');
		clearInterval(id);
	});

});

server.on('request', app);

server.listen(5000, function () {
	console.log('Listening on http://localhost:5000');
});