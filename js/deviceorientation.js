const elDebug = document.querySelector('#debug');

window.addEventListener(
  'deviceorientation',
  deviceOrientationHandler);

function deviceOrientationHandler(event) {
  const alpha = event.alpha;

  let html = alpha;
  elDebug.innerHTML = html;
}
