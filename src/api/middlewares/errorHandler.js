/* eslint-disable */

function errorHandler() {
  return async (err, req, res, next) => {
    new Promise((resolve) => {
      if (err.status !== 404) {
        console.log(err.stack);
      }
      resolve();
    });
    // if customized error
    if (err.status !== undefined) {
      res.status(err.status).send('[goose api] ' + err.message);
    }
    // pass to express default
    else {
      next(err);
    }
  };
}

module.exports = { errorHandler };
