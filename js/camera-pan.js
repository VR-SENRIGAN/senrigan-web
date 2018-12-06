const MAX_ANGLE = 270;
const MIN_ANGLE = 90;
const CAMERA_LOTATION_SETTING = -1;

mainFunction();

let i2cAccess, port, motor;

var inited = false;
var currentAngle = 180;
var motorStack = []

let tmp_onmessage = senriganSocket.ws.onmessage;
senriganSocket.ws.onmessage = ((event) => {
  tmp_onmessage(event);

  let message = JSON.parse(event.data);
  if (message.type === 'orientation') {
    setAngle(message.value);
  }
});

function setAngle(deviceAngle) {
  if (!inited || !motorStack) {
    return;
  }

  if (motorStack.length > 5) {
    motorStack.shift();
  }

  var tmpAngle = deviceAngle;
  if (deviceAngle > MAX_ANGLE ) {
    tmpAngle = MAX_ANGLE;
  } else if (deviceAngle < MIN_ANGLE) {
    tmpAngle = MIN_ANGLE;
  }

  motorStack.push(tmpAngle);
  console.log(motorStack);
}

async function changeAngle() {
  if (!inited) {
    return;
  }

  var deviceAngle = motorStack.pop();

  if (!deviceAngle) {
    return;
  }
  motorStack = [];

  console.log(motorStack);

  if (deviceAngle === currentAngle) {
    return;
  } else {
    await motor.stepperRun(angleValue(deviceAngle), 1);
    currentAngle = deviceAngle;
  }
}

function angleValue(deviceAngle) {
  return (currentAngle - deviceAngle) * 50 / 360 * CAMERA_LOTATION_SETTING;
}

async function motorInit() {
  i2cAccess = await navigator.requestI2CAccess();
  port = await i2cAccess.ports.get(1);
  motor = await new SteppingMotor(port, 0x0f);
  await motor.init();
  inited = true;
}

async function mainFunction(){
  motorInit();

  while (true)  {
    await sleep(100);
    if (!motorStack) {
      continue;
    }
    await changeAngle();
  }
}

async function sleep(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}
