var ws = new WebSocket('ws://localhost:7777/',['echo-protocol','soap', 'xmpp']);

ws.onopen = function() {//WS接続確立
   ws.send('hello');
 };

// Log errors
ws.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
ws.onmessage = function (e) {
  console.log('Server: ' + e.data);
};

ws.onclose = function () {
  console.log('Server: closed');
};

function sendToServer(num) {
   ws.send(num);
}

