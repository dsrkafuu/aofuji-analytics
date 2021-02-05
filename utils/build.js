require('./env.js')();

/* timer */
const startTime = Date.now();

/* builders */
const { buildGeoLite } = require('./build-geolite.js');
const { buildTracker } = require('./build-tracker.js');

Promise.all([buildGeoLite(), buildTracker()])
  .then(() => {
    console.log(`[goose build] api build finished in ${Date.now() - startTime}ms`);
  })
  .catch((e) => {
    console.error('[goose build]', e);
  });
