const path = require('path');
const fs = require('fs');
const terser = require('terser').minify;
const fileName = process.env.TRACKER_FILENAME || 'goose.min.js';

/**
 * build tracker to `dist`
 */
async function buildTracker() {
  const script = path.resolve(__dirname, '../src/tracker.js');
  const content = fs.readFileSync(script, { encoding: 'utf-8' });
  const folder = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  await new Promise((resolve, reject) => {
    try {
      terser(content).then((result) => {
        fs.writeFileSync(path.join(folder, fileName), result.code);
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = buildTracker;
