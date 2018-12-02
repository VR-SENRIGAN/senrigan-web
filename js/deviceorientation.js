const elDebug = document.querySelector('#debug');

if (true) {
  window.addEventListener(
    'deviceorientation',
    deviceOrientationHandler);

  var stack = [];
  function deviceOrientationHandler(event) {
    const rawAlpha = parseInt(event.alpha);

    let html = 'z値：' + rawAlpha;
    elDebug.innerHTML = html;

    if (stack.length != 0) {
      return;
    }
    stack.push(1);

    setTimeout(() => {
      stack.pop();
      if (stack.length === 0) {
        var sendValue = rawAlpha;
        if (rawAlpha > 180) {
          sendValue -= 180;
        } else {
          sendValue += 180;
        }
        // console.log(rawAlpha + ':' + sendValue);
        senriganSocket.sendToServer({type: 'orientation', value: sendValue});
      }
    }, 200);
  }
} else {
  async function dummy() {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 500));
      var alpha = Math.floor(Math.random() * 360);
      senriganSocket.sendToServer({type: 'orientation', value:alpha});
    }
  }
  dummy();
}
