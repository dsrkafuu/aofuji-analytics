/**
 * build an http error
 * @param {Number} statusCode status code
 */
module.exports = (statusCode) => {
  switch (statusCode) {
    case 403: {
      return {
        statusCode,
        statusText: 'API server route not available',
      };
    }
    case 503: {
      return {
        statusCode,
        statusText: 'API database connection failed',
      };
    }
    default: {
      return {
        statusCode: 418,
        statusText: 'You found a teapot of API server (internal error)',
      };
    }
  }
};
