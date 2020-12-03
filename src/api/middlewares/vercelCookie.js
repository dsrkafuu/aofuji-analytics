/**
 * append `Cache-Control` headers for vercel CDN
 */
module.exports = () => async (req, res, next) => {
  res.append('Cache-Control', 's-maxage=1, stale-while-revalidate');
  next();
};
