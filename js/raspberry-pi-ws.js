const senriganSocket = new SenriganSocket(7779);
const RTCPeerConnection = window.RTCPeerConnection
const RTCSessionDescription = window.RTCSessionDescription
let leftPeer;

socketConnect(senriganSocket);

async function socketConnect(senriganSocket) {
  await senriganSocket.init();
  
  let onmessage = senriganSocket.ws.onmessage;
  senriganSocket.ws.onmessage = ((event) => {
    onmessage(event);

    let message = JSON.parse(event.data);
    if (message.type === 'answer') {
      console.log('Received answer ...');
      let answer = new RTCSessionDescription(message);
      leftPeer.setAnswer(answer);
    }
  });
}

function connect() {
  leftPeer = new SenriganPeer('left');
  leftPeer.init();
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

      let leftStream = document.querySelector('video#left_video').srcObject;
      if (leftStream) {
        console.log('Adding left stream...');
        this.peer.addStream(leftStream);
      } else {
        console.warn('no left stream, but continue.');
      }

      this.peer.onicecandidate = function (evt) {
        if (evt.candidate) {
          console.log(evt.candidate);
        } else {
          console.log('empty ice event');
          peer.sendSdp(peer.localDescription);
        }
      };

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
        peer.sendSdp(peer.localDescription);
      }).catch(function(err) {
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

