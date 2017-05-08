const glob = require('glob');
const fs = require('fs');
const config = require('config');
const moment = require('moment');

const photoPath = config.get('photo.path');

/**
 * Clean up old photos
 */
glob(`${photoPath}**/*.jpg`, null, (er, files) => {
  const isoDate = moment().toISOString();
  const maxFiles = config.get('photo.maxFiles');

  if (files.length > maxFiles) {
    // Sort files: older files first in array
    files = files.sort((a, b) =>
      fs.statSync(a).mtime.getTime() - fs.statSync(b).mtime.getTime()
    );

    // Files to delete
    const filesToDelete = files.slice(0, files.length - maxFiles);

    for (const file of filesToDelete) {
      fs.unlinkSync(file);
      console.log(`${isoDate} - File: ${file} removed`);
    }
  } else {
    console.log(`${isoDate} - No files to delete 💁`);
  }
});
