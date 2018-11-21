const SenriganSocket = function(port) {
  this.port = port;
  this.ws = null;
}

SenriganSocket.prototype = {
  init: function() {
    ws = new WebSocket('ws://localhost:' + this.port + '/',['echo-protocol','soap', 'xmpp']);

    ws.onopen = function() {
     ws.send(JSON.stringify({type: 'debug', value: 'connect'}));
    };

    ws.onerror = function (error) {
      console.log('WebSocket Error ' + error);
  };

    ws.onmessage = function (e) {
      console.log('Server: ' + e.data);
    };

    ws.onclose = function () {
      console.log('Server: closed');
    };
  },

  sendToServer(json) {
   ws.send(JSON.stringify(json));
  }
}

