const senriganSocket = new SenriganSocket(7779);
senriganSocket.init();

mainFunction();

async function mainFunction(){
  const i2cAccess = await navigator.requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const motor = new SteppingMotor(port, 0x0f);
  await motor.init();

  while ( true ){
    await sleep(1000);
    console.log('.');
    await motor.stepperRun(-500, 1);
    await sleep(1000);
    await motor.stepperRun(500, 1);
  }
}

function sleep(ms){
  return new Promise( function(resolve) {
    setTimeout(resolve, ms);
  });
}
