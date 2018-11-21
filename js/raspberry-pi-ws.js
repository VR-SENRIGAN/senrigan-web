const senriganSocket = new SenriganSocket(7779);
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

RTCPeerConnection = window.RTCPeerConnection
RTCSessionDescription = window.RTCSessionDescription

let pc_config = {"iceServers":[]};
let peer = new RTCPeerConnection(pc_config);

peer.onicecandidate = function (evt) {
  if (evt.candidate) {
    console.log(evt.candidate);
  } else {
    console.log('empty ice event');
    sendSdp(peer.localDescription);
  }
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
