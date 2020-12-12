/* utils */
const httpError = require('../utils/httpError');

module.exports = (router) => {
  router.get('/*', async (req, res) => {
    res.status(404).send(httpError('Route not found'));
  });
};
