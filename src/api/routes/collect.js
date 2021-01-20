/* utils */
const { v4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const Bowser = require('bowser');
const { Reader } = require('maxmind');
const gdb = fs.readFileSync(path.resolve(__dirname, '../../../api/assets/GeoLite2-Country.mmdb'));
const maxmind = new Reader(gdb);
const httpError = require('../utils/httpError');
const requestIP = require('../utils/requestIP');
/* models */
const { Session, View, Website } = require('../utils/mongoose');

/* middlewares */
// collect route cors
const cors = require('cors');
const corsOptions = {
  origin: true,
  methods: 'POST',
  credentials: true,
  maxAge: 86400,
};

module.exports = (router) => {
  // cors prefetch
  router.options('/collect', cors(corsOptions));

  router.post('/collect', cors(corsOptions), async (req, res) => {
    const { type, id, date, data } = req.body;

    /* website and session */
    // get website
    let website = null;
    try {
      website = await Website.findById(id).lean();
      if (!website) {
        throw new Error();
      }
    } catch {
      return res.status(400).send(httpError('Request website not allowed'));
    }
    // check whether is a exist session
    const uuid = req.cookies.goose_uuid || v4();
    let session = await Session.findOne({ uuid });
    if (!session) {
      session = await Session.create({ uuid, _date: date });
      res.cookie('goose_uuid', uuid, { sameSite: 'lax' });
    }

    // data process
    const works = [];
    console.log();
    console.log('[WIP] TYPE:', type);
    console.log('[WIP] TIME:', date);
    console.log('[WIP] UUID:', uuid);
    console.log('[WIP] SITE:', website._id);
    console.log('[WIP] DATA:', data);
    console.log();

    switch (type) {
      case 'view': {
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
        break;
      }

      case 'leave': {
        if (data.pvt) {
          // update pvt to last view
          works.push(
            View.findOneAndUpdate(
              {
                // view before this leave
                _date: { $lt: date },
                _session: session._id,
                _website: website._id,
                pathname: data.path,
              },
              {
                pvt: data.pvt, // apply new page view time
              },
              {
                sort: { _date: -1 }, // first view before this leave
              }
            )
          );
        }
        break;
      }
    }

    // send response
    await Promise.all(works);
    res.status(204).send();
  });
};
