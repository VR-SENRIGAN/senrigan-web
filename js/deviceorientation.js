const elDebug = document.querySelector('#debug');
  
window.addEventListener(
  'deviceorientation',
  deviceOrientationHandler);

var stack = [];
function deviceOrientationHandler(event) {
  const alpha = event.alpha;

  let html = 'z値：' + alpha;
  elDebug.innerHTML = html;

  if (stack.length != 0) {
    return
  }
  stack.push(1);

  setTimeout(() => {
    stack.pop();
    console.log(stack)
    if (stack.length === 0) {
      sendToServer(alpha)
    }
  }, 200)
}
