const senriganSocket = new SenriganSocket(7779);
const RTCPeerConnection = window.RTCPeerConnection
const RTCSessionDescription = window.RTCSessionDescription
let leftPeer, rightPeer;

socketConnect(senriganSocket);

async function socketConnect(senriganSocket) {
  await senriganSocket.init();
  
  let onmessage = senriganSocket.ws.onmessage;
  senriganSocket.ws.onmessage = ((event) => {
    onmessage(event);

    let message = JSON.parse(event.data);
    if (message.type === 'leftsdp' && message.value.type === 'answer') {
      console.log('Received answer ...');
      let answer = new RTCSessionDescription(message.value);
      leftPeer.setAnswer(answer);
    } else if (message.type === 'rightsdp' && message.value.type === 'answer') {
      console.log('Received answer ...');
      let answer = new RTCSessionDescription(message.value);
      rightPeer.setAnswer(answer);
    }
  });
}

function connect() {
  leftPeer = new SenriganPeer('left');
  leftPeer.init();
  rightPeer = new SenriganPeer('right');
  rightPeer.init();
}

const SenriganPeer = function(name) {
  this.name = name;
  this.peer = null;
}

SenriganPeer.prototype = {
  init: function() {
    return new Promise((resolve) => {
      let pc_config = {"iceServers":[]};
      let peer = new RTCPeerConnection(pc_config);
      this.peer = peer;

      let stream = document.querySelector('video#' + this.name + '_video').srcObject;
      if (stream) {
        console.log('Adding ' + this.name + ' stream...');
        this.peer.addStream(stream);
      } else {
        console.warn('no ' + this.name + ' stream, but continue.');
      }

      this.peer.onicecandidate = function (evt) {
        if (evt.candidate) {
          console.log(evt.candidate);
        } else {
          console.log('empty ice event');
          let description = {type: this.name + 'sdp', value: peer.localDescription.toJSON()};
          this.sendSdp(description);
        }
      }.bind(this);

      this.peer.onnegotiationneeded = function(evt) { console.log('-- onnegotiationneeded() ---'); };
      this.peer.onicecandidateerror = function (evt) { console.error('ICE candidate ERROR:', evt); };
      this.peer.onsignalingstatechange = function() { console.log('== signaling status=' + peer.signalingState); };
      this.peer.onicegatheringstatechange = function() { console.log('==***== ice gathering state=' + peer.iceGatheringState); };
      this.peer.onconnectionstatechange = function() { console.log('==***== connection state=' + peer.connectionState); };
      this.peer.oniceconnectionstatechange = function() {
        console.log('== ice connection status=' + peer.iceConnectionState);
        if (peer.iceConnectionState === 'disconnected') {
          console.log('-- disconnected --');
          //hangUp();
        }
      };

      this.peer.onremovestream = function(event) {
        console.log('-- peer.onremovestream()');
        //pauseVideo(remoteVideo);
      };

      this.peer.createOffer().then(function (sessionDescription) {
        console.log('createOffer() succsess in promise');
        return peer.setLocalDescription(sessionDescription);
      }).then(function() {
        console.log('setLocalDescription() succsess in promise');
        let description = {type: this.name + 'sdp', value: peer.localDescription.toJSON()};
        this.sendSdp(description);
      }.bind(this)).catch(function(err) {
        console.error(err);
      });

      resolve();
    });
  },
  sendSdp: function(sessionDescription) {
    console.log('---sending sdp ---');
    // textForSendSdp.value = sessionDescription.sdp;
    let message = JSON.stringify(sessionDescription);
    console.log('sending SDP=' + message);
    senriganSocket.sendToServer(sessionDescription);
  },
  setAnswer: function(sessionDescription) {
    if (!this.peer) {
      console.error('peerConnection NOT exist!');
      return;
    }
    this.peer.setRemoteDescription(sessionDescription)
    .then(function() {
      console.log('setRemoteDescription(answer) succsess in promise');
    }).catch(function(err) {
      console.error('setRemoteDescription(answer) ERROR: ', err);
    });
  }
}

