const senriganSocket = new SenriganSocket(7779);
RTCPeerConnection = window.RTCPeerConnection
RTCSessionDescription = window.RTCSessionDescription

let pc_config = {"iceServers":[]};
let peer = new RTCPeerConnection(pc_config);

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
      setAnswer(answer);
    }
  });
}

function connect() {

  let leftStream = document.querySelector('video#left_video').srcObject;
  if (leftStream) {
    console.log('Adding left stream...');
    peer.addStream(leftStream);
  } else {
    console.warn('no left stream, but continue.');
  }

  peer.onicecandidate = function (evt) {
    if (evt.candidate) {
      console.log(evt.candidate);
    } else {
      console.log('empty ice event');
      sendSdp(peer.localDescription);
    }
  };

  peer.onnegotiationneeded = function(evt) { console.log('-- onnegotiationneeded() ---'); };
  peer.onicecandidateerror = function (evt) { console.error('ICE candidate ERROR:', evt); };
  peer.onsignalingstatechange = function() { console.log('== signaling status=' + peer.signalingState); };
  peer.onicegatheringstatechange = function() { console.log('==***== ice gathering state=' + peer.iceGatheringState); };
  peer.onconnectionstatechange = function() { console.log('==***== connection state=' + peer.connectionState); };
  peer.oniceconnectionstatechange = function() {
    console.log('== ice connection status=' + peer.iceConnectionState);
    if (peer.iceConnectionState === 'disconnected') {
      console.log('-- disconnected --');
      //hangUp();
    }
  };
  peer.onremovestream = function(event) {
    console.log('-- peer.onremovestream()');
    //pauseVideo(remoteVideo);
  };

  function sendSdp(sessionDescription) {
    console.log('---sending sdp ---');
    // textForSendSdp.value = sessionDescription.sdp;
    let message = JSON.stringify(sessionDescription);
    console.log('sending SDP=' + message);
    senriganSocket.sendToServer(sessionDescription);
  }

  peer.createOffer().then(function (sessionDescription) {
    console.log('createOffer() succsess in promise');
    return peer.setLocalDescription(sessionDescription);
  }).then(function() {
    console.log('setLocalDescription() succsess in promise');
    sendSdp(peer.localDescription);
  }).catch(function(err) {
    console.error(err);
  });
}

function setAnswer(sessionDescription) {
  if (!peer) {
    console.error('peerConnection NOT exist!');
    return;
  }
  peer.setRemoteDescription(sessionDescription)
  .then(function() {
    console.log('setRemoteDescription(answer) succsess in promise');
  }).catch(function(err) {
    console.error('setRemoteDescription(answer) ERROR: ', err);
  });
}
