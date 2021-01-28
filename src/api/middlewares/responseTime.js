const onHeaders = require('on-headers');

/**
 * attach response time to headers
 * @param {Object} req express request
 * @param {Object} req express response
 * @param {Function} req express next
 */
async function responseTime(req, res, next) {
  const startTime = Date.now();
  onHeaders(res, () => {
    res.set('X-Response-Time', Date.now() - startTime + 'ms');
  });
  next();
}

module.exports = { responseTime };
