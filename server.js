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

