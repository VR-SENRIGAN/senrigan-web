var WebSocketServer = require('ws');
var https = require('https');
var fs     = require('fs');

const options = {
  key: fs.readFileSync(__dirname +  '/server.key'),
  cert: fs.readFileSync(__dirname + '/server.crt')
};

var server = https.createServer(options, (request, response) => {
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

let mobileHttpsServer = https.createServer(options, (request, response) => {
    //noop
});
mobileHttpsServer.listen(7778, () => {
  console.log((new Date()) + ' Server is listening on port 7778');
});

mobileServer = new WebSocketServer.Server({
  server: mobileHttpsServer
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

let raspberryHttpsServer = https.createServer(options, (request, response) => {
    //noop
});
raspberryHttpsServer.listen(7779, () => {
  console.log((new Date()) + ' Server is listening on port 7778');
});

raspberryServer = new WebSocketServer.Server({
  server: raspberryHttpsServer
});

raspberryServer.on('connection', function connection(ws) {
  console.log('connected from Raspberrypi.');
  raspberrySocket = ws;
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    if (mobileSocket) {
      mobileSocket.send(message);
    }
  });

  ws.on('close', function close() {
    console.log('raspberrySocket disconnectede');
    raspberrySocket = null;
  });
});

