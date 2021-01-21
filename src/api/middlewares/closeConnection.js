const onHeaders = require('on-headers');

/**
 * close database connection on every res end
 */
module.exports = () => async (req, res, next) => {
  onHeaders(res, () => {
    console.log(`[debug] ${Date.now()} start disconnect db`);

    req.mongoose.disconnect();

    console.log(`[debug] ${Date.now()} disconnect db finished`);
  });
  next();
};
