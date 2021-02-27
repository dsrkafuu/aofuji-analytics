const onHeaders = require('on-headers');

function responseTime() {
  return async (req, res, next) => {
    const startTime = Date.now();
    onHeaders(res, () => {
      res.set('X-Response-Time', Date.now() - startTime + 'ms');
    });
    next();
  };
}

module.exports = responseTime;
