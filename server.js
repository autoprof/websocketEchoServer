"use strict";

import http													from 'http';
import WebSocket										from 'websocket';


var webSocketsServerPort = 3000;
var server = http.createServer((request, response)  => {});
var wsServer = new WebSocket.server({httpServer: server});
server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

const clients = [];

wsServer.on('request', function(request) {

	var clt = request.accept(null, request.origin);
	clients.push(clt);

	console.log('New client');

	clt.send(JSON.stringify({
		date: "01/01/2021 00:00:00",
		pseudo: "<server>",
		text: "Connection OK",
	}));


	clt.on('message', function (msg) {
		console.log("message reçu");
		console.log(msg.utf8Data);
		if (msg.type === 'utf8') {
			for(var i = 0; i < clients.length; i++) {
				console.log("send message");
				clt.send(msg.utf8Data);
			}
		}
	});

	clt.on('close', function(_clt) {
		console.log("client quit")
		clients.splice(clients.findIndex(c => c === clt), 1);
	});

});
