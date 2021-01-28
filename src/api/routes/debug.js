/* utils */
const { buildError } = require('../utils/buildError.js');
const { requestIP } = require('../utils/requestIP.js');
const { Website, Account } = require('../utils/mongoose.js');

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
      const results = await Promise.all([Website.findOne({}).lean(), Account.findOne({}).lean()]);
      response.db = results;

      // geodb check
      const userIP = requestIP(req);
      if (userIP) {
        const user = maxmind.get(userIP);
        response.maxmind = { ip: userIP, ...user };
      }

      // send response
      res.send(response);
    } catch (e) {
      console.log(e.stack);
      throw buildError(500, 'debug test failed');
    }
  });
};
