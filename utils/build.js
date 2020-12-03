require('./env')();

/* timer */
const startTime = Date.now();

/* builders */
const buildTracker = require('./build-tracker');

Promise.all([buildTracker()])
  .then(() => {
    console.log(`[Goose Build] API build finished in ${Date.now() - startTime}ms`);
  })
  .catch((e) => {
    console.error('[Goose Build]', e);
  });
