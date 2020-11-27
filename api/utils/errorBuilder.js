/**
 * build an http error
 * @param {Number} statusCode status code
 */
module.exports = (statusCode) => {
  switch (statusCode) {
    case 403: {
      return {
        statusCode,
        statusText: 'API route not available',
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
