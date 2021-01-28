/**
 * get request ip
 * @param {Object} req express request
 * @return {string}
 */
function requestIP(req) {
  return (
    req.get('X-Client-IP') ||
    req.get('X-Forwarded-For') ||
    req.get('Cf-Connecting-IP') ||
    req.get('X-Real-IP') ||
    req.ip ||
    ''
  )
    .split(',')[0]
    .trim();
}

module.exports = { requestIP };
