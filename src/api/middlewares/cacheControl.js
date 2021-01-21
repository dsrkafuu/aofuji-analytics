/**
 * append `Cache-Control` headers for vercel CDN
 * https://vercel.com/docs/serverless-functions/edge-caching#recommended-cache-control
 */
module.exports = () => async (req, res, next) => {
  res.append('Cache-Control', 's-maxage=1, stale-while-revalidate');
  next();
};
