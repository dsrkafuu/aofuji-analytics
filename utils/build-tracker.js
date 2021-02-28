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

  const dist = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
  }

  const src = path.resolve(__dirname, '../node_modules/vector-tracker/lib/vector.min.js');
  const dest = path.resolve(__dirname, `../dist/${fileName}`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

module.exports = buildTracker;
