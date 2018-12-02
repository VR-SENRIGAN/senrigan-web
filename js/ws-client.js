const SenriganSocket = function(port) {
  this.port = port;
  this.ws = null;
}

SenriganSocket.prototype = {
  init: function() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket('wss://' + location.hostname + ':' + this.port + '/',['echo-protocol','soap', 'xmpp']);

      this.ws.onopen = function() {
        this.send(JSON.stringify({type: 'debug', value: 'connect'}));
        resolve();
      };

      this.ws.onerror = function (error) {
        console.log('WebSocket Error ' + error);
        reject
      };

      this.ws.onmessage = function (e) {
        // log('Server: ' + e.data);
      };

      this.ws.onclose = function () {
        console.log('Server: closed');
      };
    });
  },

  sendToServer(json) {
   this.ws.send(JSON.stringify(json));
  }
}

