var WebSocketServer = require('websocket').server;
var http = require('http');
var fs     = require('fs');

var server = http.createServer((request, response) => {
  console.log((new Date()) + ' Received request for ' + request.url);
  fs.readFile(__dirname + request.url, 'utf-8', function (err, data) {
    if (err) {
      response.writeHead(404, {'Content-Type' : 'text/plain'});
      response.write('page not found');
      return response.end();
    }

    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(data);
    response.end();
  });
});

server.listen(7777, () => {
  console.log((new Date()) + ' Server is listening on port 7777');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

var connections = [];
wsServer.on('request', function(request) {
  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  connections.push(connection);
  console.log('connections.length:' + connections.length);

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connections.forEach((c) => {
        c.sendUTF(message.utf8Data);
      });
  });

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    console.log('connections.length:' + connections.length);
  });
});

