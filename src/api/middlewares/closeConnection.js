const onHeaders = require('on-headers');

/**
 * close database connection on every res end
 */
module.exports = () => async (req, res, next) => {
  onHeaders(res, () => {
    req.mongoose.disconnect();
  });
  next();
};
