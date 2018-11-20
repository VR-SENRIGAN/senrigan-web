const debug = Boolean(navigator.userAgent.match('Macintosh'));
const elDebug = document.querySelector('#debug');

if (!debug) {
  window.addEventListener(
    'deviceorientation',
    deviceOrientationHandler);

  var stack = [];
  function deviceOrientationHandler(event) {
    const alpha = event.alpha;

    let html = 'z値：' + alpha;
    elDebug.innerHTML = html;

    if (stack.length != 0) {
      return;
    }
    stack.push(1);

    setTimeout(() => {
      stack.pop();
      if (stack.length === 0) {
        sendToServer(alpha);
      }
    }, 200);
  }
} else {
  async function dummy() {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 500));
      var alpha = Math.floor(Math.random() * 360);
      console.log(200);
      senriganSocket.sendToServer(alpha);
    }
  }
  dummy();
}
