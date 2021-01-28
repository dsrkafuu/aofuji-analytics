/* eslint-disable */

/**
 * custom error handler
 * @param {Error} err custom express error
 * @param {Object} req express request
 * @param {Object} req express response
 * @param {Function} req express next
 */
async function errorHandler(err, req, res, next) {
  new Promise((resolve) => {
    console.log(err.stack);
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
}

module.exports = { errorHandler };
