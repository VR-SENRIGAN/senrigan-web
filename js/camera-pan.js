mainFunction();

async function mainFunction(){
  const i2cAccess = await navigator.requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const motor = new SteppingMotor(port, 0x0f);
  motor.init();

  while ( true ){
    await sleep(1000);
    console.log('.');
    motor.stepperRun(-500, 0).then(()=> {console.log('success')}, () =>{console.log('failed')});
    await sleep(1000);
    motor.stepperRun(500, 0).then(()=> {console.log('success')}, () =>{console.log('failed')});
  }
}

function sleep(ms){
  return new Promise( function(resolve) {
    setTimeout(resolve, ms);
  });
}
