const { static: serveStatic } = require('express');
const history = require('connect-history-api-fallback');

/**
 * port listener
 * @param {Object} app express app
 */
module.exports = (app) => {
  app.use(history());
  app.use(serveStatic('dist'));
};
