const debug = true;
const debug_area = document.querySelector('#debug_area');

function log(message) {
  if (debug && debug_area) {
    json_message = JSON.stringify(message);
    debug_area.value = debug_area.value + '\n' + json_message
  }
  console.log(message);
}

