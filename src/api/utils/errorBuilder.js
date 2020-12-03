/**
 * build an http error
 * @param {Number} status status code
 */
module.exports = (status) => {
  switch (status) {
    case 403: {
      return {
        status,
        statusText: 'API server route not available',
      };
    }
    case 503: {
      return {
        status,
        statusText: 'API database connection failed',
      };
    }
    default: {
      return {
        status: 418,
        statusText: 'You found a teapot of API server (internal error)',
      };
    }
  }
};
