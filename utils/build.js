require('./env')();

// timer
const startTime = Date.now();

// builders
const buildGeoLite = require('./build-geolite');
const buildTracker = require('./build-tracker');

Promise.all([buildGeoLite(), buildTracker()])
  .then(() => {
    console.log(`[aofuji] api build finished in ${Date.now() - startTime}ms`);
  })
  .catch((e) => {
    console.error('[aofuji]', e);
  });
