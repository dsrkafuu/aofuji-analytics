/* utils */
const path = require('path');
const fs = require('fs');
const requestIP = require('../utils/requestIP.js');
const buildError = require('../utils/buildError.js');
const { Session, View, Website } = require('../utils/mongoose.js');

/* deps */
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
  maxAge: 86400, // 1 day
};

module.exports = (router) => {
  router.options('/collect', cors(corsOptions));

  router.post('/collect', cors(corsOptions), async (req, res) => {
    // get basic params
    const { t: type, id, sid, d: date, p: pathname } = req.body;

    // init website and session
    const initWebsite = async () => {
      let website = null;
      try {
        website = await Website.findById(id).lean();
      } catch {
        website = null;
        throw buildError(403, 'request website not allowed');
      }
      if (!website) {
        throw buildError(403, 'request website not allowed');
      }
      return website;
    };
    let needNewSession = false;
    const initSession = async () => {
      let session = null;
      try {
        session = await Session.findById(sid);
      } catch {
        needNewSession = true;
      }
      if (!session) {
        needNewSession = true;
      }
      if (needNewSession) {
        session = await Session.create({ _date: date });
      }
      return session;
    };
    const [website, session] = await Promise.all([initWebsite(), initSession()]);

    try {
      // data process
      switch (type) {
        case 'view': {
          const works = [];
          // get params
          const { r: referrer, lng: language, scn: screen } = req.body;
          // not add same page view from same user in 5 minute
          const lastView = await View.findOne({
            _date: { $lt: date },
            _session: session._id,
            _website: website._id,
            pathname,
          })
            .sort({ _date: -1 })
            .lean();
          if (!lastView || date - lastView._date > 300 * 1000) {
            // save view
            const newView = {
              _date: date,
              _session: session._id,
              _website: website._id,
              pathname,
              referrer,
            };
            works.push(View.create(newView));
          }
          // check whether need to update session data
          if (language || screen) {
            // language & screen
            session.language = language;
            session.screen = screen;
            // browser & system & platform
            const bowser = Bowser.parse(req.get('User-Agent'));
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
          const { pvt } = req.body;
          if (pvt) {
            // update pvt to last view
            await View.findOneAndUpdate(
              // view before this leave
              {
                _date: { $lt: date },
                _session: session._id,
                _website: website._id,
                pathname,
              },
              // add new page view time (not replace)
              { $inc: { pvt } }
            )
              .sort({ _date: -1 })
              .lean();
          }
          break;
        }
      }
    } catch (e) {
      throw buildError(500, 'error processing data');
    }

    // send response
    if (needNewSession) {
      res.status(201).send({ sid: session._id });
    } else {
      res.status(204).send();
    }
  });
};
