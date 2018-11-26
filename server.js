var WebSocketServer = require('ws');
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

var mobileSocket, raspberrySocket;

mobileServer = new WebSocketServer.Server({
  port: 7778
});

mobileServer.on('connection', function connection(ws) {
  console.log('connected from mobile.');
  mobileSocket = ws;
  ws.on('message', function incoming(message) {
    //console.log('received: %s', message);
    if (raspberrySocket) {
      raspberrySocket.send(message);
    }
  });

  ws.on('close', function close() {
    console.log('mobileSocket disconnectede');
    mobileSocket = null;
  });
});

raspberryServer = new WebSocketServer.Server({
  port: 7779
});

raspberryServer.on('connection', function connection(ws) {
  console.log('connected from Raspberrypi.');
  raspberrySocket = ws;
  ws.on('message', function incoming(message) {
    //console.log('received: %s', message);
    if (mobileSocket) {
      mobileSocket.send(message);
    }
  });

  ws.on('close', function close() {
    console.log('raspberrySocket disconnectede');
    raspberrySocket = null;
  });
});

