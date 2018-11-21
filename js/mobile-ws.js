const senriganSocket = new SenriganSocket(7778);
socketConnect(senriganSocket);

async function socketConnect(senriganSocket) {
  await senriganSocket.init();

  let onmessage = senriganSocket.ws.onmessage;
  senriganSocket.ws.onmessage = ((event) => {
    onmessage(event);

    let message = JSON.parse(event.data);
    if (message.type === 'offer') {
      console.log('Received offer ...');
      let offer = new RTCSessionDescription(message);
      setOffer(offer);
    }
  });
}

RTCPeerConnection = window.RTCPeerConnection
RTCSessionDescription = window.RTCSessionDescription

let pc_config = {"iceServers":[]};
let peer = new RTCPeerConnection(pc_config);

function setOffer(sessionDescription) {
  peer.setRemoteDescription(sessionDescription).then(function() {
      console.log('setRemoteDescription(offer) succsess in promise');
      makeAnswer();
  }).catch(function(err) {
    console.error('setRemoteDescription(offer) ERROR: ', err);
  });
}

function makeAnswer() {
  console.log('sending Answer. Creating remote session description...' );
  if (! peer) {
    console.error('peerConnection NOT exist!');
    return;
  }

  peer.createAnswer()
  .then(function (sessionDescription) {
    console.log('createAnswer() succsess in promise');
    return peer.setLocalDescription(sessionDescription);
  }).then(function() {
    console.log('setLocalDescription() succsess in promise');
    sendSdp(peer.localDescription);
  }).catch(function(err) {
    console.error(err);
  });
}

function sendSdp(sessionDescription) {
  console.log('---sending sdp ---');
  let message = JSON.stringify(sessionDescription);
  console.log('sending SDP=' + message);
  senriganSocket.sendToServer(sessionDescription);
}
