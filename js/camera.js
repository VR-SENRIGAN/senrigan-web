var audio;

async function setAudioSource(selector) {
  const audioSelect = document.querySelector(selector);

  navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
    for (let i = 0; i < deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label
        var audioSelect = document.querySelector('select#audio');
        audioSelect.appendChild(option);
      }
    }
  });

  audioSelect.onchange = start;

  start();

  function start(){
    let audioSource = audioSelect.value;

    let constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined}
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      audio = stream;
    })
  }
};

async function setVideoSource(video, selector, name) {
  return new Promise((resolve) => {
    const videoElement = document.querySelector(video);
    const videoSelect = document.querySelector(selector);

    navigator.mediaDevices.enumerateDevices().then(gotDevices); 

    videoSelect.onchange = start;

    start();

    function gotDevices(deviceInfos) {
      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
          videoSelect.appendChild(option);
        }
      }
    }

    function gotStream(stream) {
      window.stream = stream; // make stream available to console
      videoElement.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    }

    function gotStream2(stream) {
      stream.addTrack(audio.getTracks()[0]);
      window.stream = stream; // make stream available to console
      videoElement.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    }

    function start() {
      let videoSource = videoSelect.value;
      let constraints = {
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
      };

      if (name === 'left') {
        navigator.mediaDevices.getUserMedia(constraints).then(gotStream2);
      } else {
        navigator.mediaDevices.getUserMedia(constraints).then(gotStream);
      }
    }
  });
}
