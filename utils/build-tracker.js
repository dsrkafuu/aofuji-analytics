const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const terser = require('terser').minify;
const fileName = process.env.VUE_APP_TRACKER_FILENAME || 'vector.min.js';

/**
 * build tracker to `dist`
 */
async function buildTracker() {
  const script = path.resolve(__dirname, '../src/tracker.js');
  const folder = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  let content = fs.readFileSync(script, { encoding: 'utf-8' });

  // babel
  const result = babel.transformSync(content, {
    // prevent from using vue app's babel config
    configFile: path.resolve(__dirname, '../babel.tracker.json'),
  });
  content = result.code;

  // terser
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
