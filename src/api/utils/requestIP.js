/**
 * get request ip
 * @param {*} req express request
 */
module.exports = (req) =>
  (
    req.get('X-Client-IP') ||
    req.get('X-Forwarded-For') ||
    req.get('Cf-Connecting-IP') ||
    req.get('X-Real-IP') ||
    req.ip ||
    ''
  )
    .split(',')[0]
    .trim();
