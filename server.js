var WebSocketServer = require('websocket').server;
var http = require('http');
var fs     = require('fs');

var server = http.createServer((request, response) => {
  console.log((new Date()) + ' Received request for ' + request.url);
  fs.readFile(__dirname + request.url, 'utf-8', function (err, data) {
    // エラー発生時
    if (err) {
      response.writeHead(404, {'Content-Type' : 'text/plain'});
      response.write('page not found');
      // returnを使って、ここで処理を終了させる
      return response.end();
    }

    // 表示させるのはtextじゃなくて、htmlなので、text/htmlにする
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

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

