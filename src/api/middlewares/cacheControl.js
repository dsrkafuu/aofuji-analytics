/**
 * @param {Object} req express request
 * @param {Object} req express response
 * @param {Function} req express next
 */
async function cacheControl(req, res, next) {
  res.append('Cache-Control', 'public, s-maxage=1, must-revalidate');
  next();
}

module.exports = { cacheControl };
