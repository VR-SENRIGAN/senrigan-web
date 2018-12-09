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

const VideoSource = function(videoSelector, pulldownSelector, name) {
  this.videoElement = document.querySelector(videoSelector);
  this.videoSelect = document.querySelector();
  this.videoSelector = videoSelector;
  this.pulldownSelector = pulldownSelector;
  this.name = name;
}

VideoSource.prototype = {
  init: function() {
    return new Promise((resolve) => {
      navigator.mediaDevices.enumerateDevices().then(getDevices);

      videoSelect.onchange = start;
    }
  },

  getDevices: function(deviceInfos) {
    deviceInfos.foreach((deviceInfo) => {
      // const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
      }
    }
  },
  getStream: function (stream) {
    if (this == 'left') {
      stream.addTrack(audio.getTracks()[0]);
    }
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
  },
  start: start() {
    let videoSource = videoSelect.value;
    let constraints = {
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream.bind(name));
  }
}
