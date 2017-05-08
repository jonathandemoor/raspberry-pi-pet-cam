const Raspi = require('raspi-io');
const Five = require('johnny-five');
const moment = require('moment');
const config = require('config');
const cam = require('./cam');

const board = new Five.Board({ io: new Raspi() });

board.on('ready', () => {
  console.log('Board ready 🎬');

  // Create a new `motion sensor` hardware instance.
  // Calibration delay in milliseconds
  const motionSensor = new Five.Motion({
    pin: config.get('raspberryBoardPin'),
    calibrationDelay: config.get('calibrationDelay'),
  });

  // "calibrated" occurs once, at the beginning of a session,
  motionSensor.on('calibrated', () => {
    console.log('calibrated 🙏');
  });

  // The "motionstart" event is fired when motion occurs within
  // the observable range of the PIR/Motion/IR.Proximity sensor
  motionSensor.on('motionstart', () => {
    const currentDate = moment();

    console.log(`motionstart 👋  - ${currentDate.toISOString()}`);

    const currentTime = moment(currentDate.format('HH:mm'), 'HH:mm');
    const startTime = moment(config.get('motionTime.start'), 'HH:mm');
    const endTime = moment(config.get('motionTime.end'), 'HH:mm');

    // Only take a photo between start and end time
    if (currentTime.isBetween(startTime, endTime)) {
      cam.takePhoto();

      // Take a second photo ¯\_(ツ)_/¯
      setTimeout(() => {
        cam.takePhoto();
      }, 2000);
    }
  });

  // The "motionend" event is fired when motion has ceased within
  // the observable range of the PIR/Motion/IR.Proximity sensor.
  motionSensor.on('motionend', () => {
    console.log('motionend 🚀');
  });
});
