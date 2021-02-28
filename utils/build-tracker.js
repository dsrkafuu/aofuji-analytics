const path = require('path');
const fs = require('fs');

const fileName = process.env.VUE_APP_TRACKER_FILENAME;

/**
 * build custom tracker to `dist`
 */
function buildTracker() {
  if (!fileName) {
    return;
  }

  const src = path.resolve(__dirname, '../node_modules/vector-tracker/lib/vector.min.js');
  const dest = path.resolve(__dirname, `../dist/${fileName}`);
  fs.copyFileSync(src, dest);
}

module.exports = buildTracker;
