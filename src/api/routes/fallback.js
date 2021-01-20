/* utils */
const httpError = require('../utils/httpError');

module.exports = (router) => {
  // debug router
  router.get('/debug', async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const gdb = fs.readFileSync(
      path.resolve(__dirname, '../../../api/assets/GeoLite2-Country.mmdb')
    );
    const { Reader } = require('maxmind');
    const maxmind = new Reader(gdb);
    const gd = maxmind.get('8.8.8.8');
    res.status(200).send(gd);
  });

  router.get('/*', async (req, res) => {
    res.status(404).send(httpError('Route not found'));
  });
};
