const RaspiCam = require('raspicam');
const config = require('config');
const moment = require('moment');

const photoPath = config.get('photo.path');
const photoWidth = config.get('photo.dimensions.width');
const photoHeight = config.get('photo.dimensions.height');
const flipPhotoVertical = config.get('photo.flipPhotoVertical');

const camera = new RaspiCam({
  mode: 'photo',
  output: './photos/images_test.jpg',
  encoding: 'jpg',
  vf: flipPhotoVertical,
  w: photoWidth,
  h: photoHeight,
  timeout: 2000,
});

/**
 * Take photo with RaspiCam
 */
exports.takePhoto = () => {
  const isoDate = moment().toISOString();
  const photoFileName = `image_${isoDate}.jpg`;

  console.log(`take photo 📸  - ${isoDate}`);

  // Set file name
  camera.set('output', photoPath + photoFileName);

  // Take photo
  camera.start();
};
