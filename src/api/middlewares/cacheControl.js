const defaultOptions = {
  allowCache: false,
};

function cacheControl(options = defaultOptions) {
  const { allowCache } = options;
  if (allowCache) {
    return async (req, res, next) => {
      res.append('Cache-Control', 'public, s-maxage=1, stale-while-revalidate');
      next();
    };
  } else {
    return async (req, res, next) => {
      res.append('Cache-Control', 'public, s-maxage=1, must-revalidate');
      next();
    };
  }
}

module.exports = { cacheControl };
