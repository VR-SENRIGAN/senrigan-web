socketConnect();

async function socketConnect() {
  const senriganSocket = new SenriganSocket(7779);
  await senriganSocket.init();

  let onmessage = senriganSocket.ws.onmessage;
  senriganSocket.ws.onmessage = ((event) => {
    onmessage(event);
    console.log(event)
  });

  RTCPeerConnection = window.RTCPeerConnection
  RTCSessionDescription = window.RTCSessionDescription

  let pc_config = {"iceServers":[]};
  let peer = new RTCPeerConnection(pc_config);
}

function setOffer(sessionDescription) {
  if (peerConnection) {
    console.error('peerConnection alreay exist!');
  }
  peerConnection = prepareNewConnection();
  peerConnection.setRemoteDescription(sessionDescription).then(function() {
      console.log('setRemoteDescription(offer) succsess in promise');
      makeAnswer();
  }).catch(function(err) {
    console.error('setRemoteDescription(offer) ERROR: ', err);
  });
}

function makeAnswer() {
  console.log('sending Answer. Creating remote session description...' );
  if (! peerConnection) {
    console.error('peerConnection NOT exist!');
    return;
  }
  
  peerConnection.createAnswer()
  .then(function (sessionDescription) {
    console.log('createAnswer() succsess in promise');
    return peerConnection.setLocalDescription(sessionDescription);
  }).then(function() {
    console.log('setLocalDescription() succsess in promise');
    // -- Trickle ICE の場合は、初期SDPを相手に送る -- 
    // -- Vanilla ICE の場合には、まだSDPは送らない --
    //sendSdp(peerConnection.localDescription);
  }).catch(function(err) {
    console.error(err);
  });
}
