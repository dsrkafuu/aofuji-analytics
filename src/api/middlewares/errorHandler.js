/* eslint-disable */

/**
 * custom error handler
 */
module.exports = () => async (err, req, res, next) => {
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
};
