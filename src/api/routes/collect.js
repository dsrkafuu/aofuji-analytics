/* utils */
const path = require('path');
const fs = require('fs');
const requestIP = require('../utils/requestIP.js');
const { Session, View, Website } = require('../utils/mongoose.js');

/* deps */
const { v4 } = require('uuid');
const Bowser = require('bowser');
const { Reader } = require('maxmind');
const gdb = fs.readFileSync(path.resolve(__dirname, '../../../api/assets/GeoLite2-Country.mmdb'));
const maxmind = new Reader(gdb);

/* middlewares */
const cors = require('cors');
// collect route cors settings
const corsOptions = {
  origin: true,
  methods: 'POST',
  credentials: true,
  maxAge: 86400,
};

module.exports = (router) => {
  // cors prefetch
  router.options('/collect', cors(corsOptions));

  // collect route
  router.post('/collect', cors(corsOptions), async (req, res) => {
    const { type, id, date, data } = req.body;

    // get website
    let website = null;
    try {
      website = await Website.findById(id).lean();
      if (!website) {
        throw new Error();
      }
    } catch {
      const err = new Error('request website not allowed');
      err.status = 403;
      throw err;
    }

    try {
      // check whether is a exist session
      const uuid = req.cookies.goose_uuid || v4();
      let session = await Session.findOne({ uuid });
      if (!session) {
        session = await Session.create({ uuid, _date: date });
        res.cookie('goose_uuid', uuid, { sameSite: 'lax' });
      }

      // data process
      console.log();
      console.log('[WIP] TYPE:', type);
      console.log('[WIP] TIME:', date);
      console.log('[WIP] UUID:', uuid);
      console.log('[WIP] SITE:', website._id);
      console.log('[WIP] DATA:', data);
      console.log();

      switch (type) {
        case 'view': {
          const works = [];
          // save view
          const newView = {
            _date: date,
            _session: session._id,
            _website: website._id,
            pathname: data.path,
            referrer: data.ref,
          };
          works.push(View.create(newView));
          // check whether need to update session data
          if (data.lang || data.scrn) {
            // language & screen
            session.language = data.lang;
            session.screen = data.scrn;
            // browser & system & platform
            const ua = req.get('User-Agent');
            const bowser = Bowser.parse(ua);
            session.browser = (bowser.browser.name || '').toLowerCase() || undefined;
            session.system = (bowser.os.name || '').toLowerCase() || undefined;
            session.platform = (bowser.platform.type || '').toLowerCase() || undefined;
            // location
            const gd = maxmind.get(requestIP(req));
            session.location = gd && gd.country ? gd.country.iso_code : undefined;
            works.push(session.save());
          }
          await Promise.all(works);
          break;
        }

        case 'leave': {
          if (data.pvt) {
            // update pvt to last view
            await View.findOneAndUpdate(
              // view before this leave
              {
                _date: { $lt: date },
                _session: session._id,
                _website: website._id,
                pathname: data.path,
              },
              // apply new page view time
              { pvt: data.pvt },
              // first view before this leave
              { sort: { _date: -1 } }
            );
          }
          break;
        }
      }
    } catch {
      const err = new Error('error processing data');
      err.status = 500;
      throw err;
    }

    // send response
    res.status(204).send();
  });
};
