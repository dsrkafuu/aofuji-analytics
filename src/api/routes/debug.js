/* utils */
const { Website, User } = require('../utils/mongoose.js');
const buildError = require('../utils/buildError.js');

/* deps */
const fs = require('fs');
const path = require('path');
const Bowser = require('bowser');
const { Reader } = require('maxmind');
const gdb = fs.readFileSync(path.resolve(__dirname, '../../../api/assets/GeoLite2-Country.mmdb'));
const maxmind = new Reader(gdb);

module.exports = (router) => {
  // debug route
  router.get('/debug', async (req, res) => {
    try {
      const response = {};

      // Bowser check
      const ua = req.get('User-Agent');
      const bowser = Bowser.parse(ua);
      response.bowser = bowser;

      // database check
      const results = await Promise.all([Website.findOne({}).lean(), User.findOne({}).lean()]);
      response.db = results;

      // geodb check
      const gd1 = maxmind.get('1.1.1.1');
      const gd2 = maxmind.get('114.48.198.220');
      response.maxmind = [gd1, gd2];

      res.send(response);
    } catch (e) {
      console.log(e.stack);
      throw buildError(418, 'debug test failed');
    }
  });
};
