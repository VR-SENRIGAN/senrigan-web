const SenriganSocket = function(port) {
  this.port = port;
  this.ws = null;
  this.onmessages = [];
}

SenriganSocket.prototype = {
  init: function() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket('ws://localhost:' + this.port + '/',['echo-protocol','soap', 'xmpp']);

      this.ws.onopen = function() {
        this.send('hello');
        resolve();
      };

      this.ws.onerror = function (error) {
        console.log('WebSocket Error ' + error);
      };

      this.ws.onmessage = function (e) {
        console.log('Server: ' + e.data);
      };

      this.ws.onclose = function () {
        console.log('Server: closed');
      };
    });
  },

  sendToServer(num) {
   this.ws.send(num);
  }
}

