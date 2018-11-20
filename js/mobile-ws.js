const senriganSocket = new SenriganSocket(7778);
senriganSocket.init();

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
  senriganSocket.sendToServer(message);
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



