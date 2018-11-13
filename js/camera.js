function setVideoSource(video, selector) {
  const videoElement = document.querySelector(video);
  const videoSelect = document.querySelector(selector);

  navigator.mediaDevices.enumerateDevices().then(gotDevices); 
  function gotDevices(deviceInfos) {
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
  }

  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
  }

  function start() {
    const videoSource = videoSelect.value;
    const constraints = {
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices);
  }

  videoSelect.onchange = start;

  start();
}

window.addEventListener('load', function() {
  setVideoSource('video#left_video', 'select#left_camera');
  setVideoSource('video#right_video', 'select#right_camera');
});

