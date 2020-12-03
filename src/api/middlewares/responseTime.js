const onHeaders = require('on-headers');

/**
 * show response time in log
 */
module.exports = () => async (req, res, next) => {
  const startTime = Date.now();
  onHeaders(res, () => {
    res.set('X-Response-Time', Date.now() - startTime + 'ms');
  });
  next();
};
