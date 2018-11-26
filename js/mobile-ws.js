const senriganSocket = new SenriganSocket(7778);
RTCPeerConnection = window.RTCPeerConnection
RTCSessionDescription = window.RTCSessionDescription
let leftPeer, rightPeer;

socketConnect(senriganSocket);

async function socketConnect(senriganSocket) {
  await senriganSocket.init();

  let onmessage = senriganSocket.ws.onmessage;
  senriganSocket.ws.onmessage = ((event) => {
    onmessage(event);

    let message = JSON.parse(event.data);
    if (message.type === 'leftsdp' &&  message.value.type === 'offer') {
      console.log('Received offer ...');
      let offer = new RTCSessionDescription(message.value);
      leftPeer.setOffer(offer);
    } else if (message.type === 'rightsdp' &&  message.value.type === 'offer') {
      console.log('Received offer ...');
      let offer = new RTCSessionDescription(message.value);
      rightPeer.setOffer(offer);
    }
  });
}

const SenriganPeer = function(name) {
  this.name = name;
  this.peer = null;
}

SenriganPeer.prototype = {
  init: function() {
    let pc_config = {"iceServers":[]};
    this.peer = new RTCPeerConnection(pc_config);

    this.peer.onaddstream = function(event) {
      console.log('-- peer.onaddstream()');
      let stream = event.stream;
      let video = document.querySelector('video#' + this.name + '_video');
      video.srcObject = stream
    }.bind(this);
  },

  sendSdp: function (sessionDescription) {
    console.log('---sending sdp ---');
    let message = JSON.stringify(sessionDescription);
    console.log('sending SDP=' + message);
    senriganSocket.sendToServer(sessionDescription);
  },

  setOffer: function (sessionDescription) {
    this.peer.setRemoteDescription(sessionDescription).then(function() {
      console.log('setRemoteDescription(offer) succsess in promise');
      this.makeAnswer();
    }.bind(this)).catch(function(err) {
      console.error('setRemoteDescription(offer) ERROR: ', err);
    });
  },

  makeAnswer: function() {
    console.log('sending Answer. Creating remote session description...' );
    if (! this.peer) {
      console.error('peerConnection NOT exist!');
      return;
    }

    this.peer.createAnswer().then(function (sessionDescription) {
      console.log('createAnswer() succsess in promise');
      return this.peer.setLocalDescription(sessionDescription);
    }.bind(this)).then(function() {
      console.log('setLocalDescription() succsess in promise');
      let description = {type: this.name + 'sdp', value: this.peer.localDescription.toJSON()}
      this.sendSdp(description);
    }.bind(this)).catch(function(err) {
      console.error(err);
    });
  }
}

leftPeer = new SenriganPeer('left');
leftPeer.init();
rightPeer = new SenriganPeer('right');
rightPeer.init();
