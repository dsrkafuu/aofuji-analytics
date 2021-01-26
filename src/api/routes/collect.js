/* deps */
const isLocalhost = require('is-localhost-ip');
const isBot = require('isbot');

/* utils */
const requestIP = require('../utils/requestIP.js');
const buildError = require('../utils/buildError.js');
const { Session, View, Website } = require('../utils/mongoose.js');

/* middlewares */
const cors = require('cors');
// collect route cors settings
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST'],
  credentials: false,
  maxAge: 86400, // 1 day
};

/**
 * check query type
 * @param {string} type
 * @param {any} value
 */
function checkType(type, value) {
  if (value === undefined || value === null) {
    return undefined;
  }
  switch (type) {
    case 'string':
      return typeof value === 'string' ? value : String(value);
    case 'number':
      return typeof value === 'number' ? value : Number(value);
    default:
      return undefined;
  }
}

const collectRoute = () => async (req, res) => {
  // get basic params
  let { t: type, id, sid, d: date, p: pathname } = req.query;
  type = checkType('string', type);
  id = checkType('string', id);
  sid = checkType('string', sid);
  date = checkType('number', date);
  pathname = checkType('string', pathname);

  // ip check
  const clientIP = requestIP(req);
  const checkIP = async () => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    if (clientIP) {
      let result = false;
      try {
        result = await isLocalhost(clientIP);
      } catch {
        result = true;
      }
      if (result) {
        res.status(202).send();
      }
    }
  };
  // bot check
  const clientUA = req.get('User-Agent');
  const checkBot = async () => {
    const result = isBot(clientUA);
    if (result) {
      res.status(202).send();
    }
  };

  // init website
  const initWebsite = async () => {
    let website = null;
    try {
      website = await Website.findById(id).lean();
    } catch {
      website = null;
    }
    if (!website) {
      throw buildError(400, 'request website not allowed');
    }
    return website;
  };
  // init session
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
      if (type === 'view') {
        session = await Session.create({ _date: date });
      } else {
        throw buildError(400, 'session init not allowed except view request');
      }
    }
    return session;
  };

  // parallel works
  await Promise.all([checkIP(), checkBot()]);
  const [website, session] = await Promise.all([initWebsite(), initSession()]);

  try {
    // data process
    switch (type) {
      case 'view': {
        const works = [];
        // get params
        let { r: referrer, lng: language, scn: screen } = req.query;
        referrer = checkType('string', referrer);
        language = checkType('string', language);
        screen = checkType('string', screen);
        // not add same page view from same user in 10 minute
        const lastView = await View.findOne({
          _date: { $lt: date },
          _session: session._id,
          _website: website._id,
          pathname,
        })
          .sort({ _date: -1 })
          .lean();
        if (!lastView || date - lastView._date > 600 * 1000) {
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
        if (needNewSession || language || screen) {
          // load deps needed
          const path = require('path');
          const fs = require('fs');
          const Bowser = require('bowser');
          const { Reader } = require('maxmind');
          const gdb = fs.readFileSync(
            path.resolve(__dirname, '../../../api/assets/GeoLite2-Country.mmdb')
          );
          const maxmind = new Reader(gdb);
          // language & screen
          session.language = language;
          session.screen = screen;
          // browser & system & platform
          const bowser = Bowser.parse(req.get('User-Agent'));
          const fmtBowser = (str) => (str || '').toLowerCase().replace(/ +/gi, '-') || undefined;
          session.browser = fmtBowser(bowser.browser.name);
          session.system = fmtBowser(bowser.os.name);
          session.platform = fmtBowser(bowser.platform.type);
          // location
          if (clientIP) {
            const gd = maxmind.get(clientIP);
            session.location = gd && gd.country ? gd.country.iso_code : undefined;
          }
          works.push(session.save());
        }
        await Promise.all(works);
        break;
      }

      case 'leave': {
        let { pvt } = req.query;
        pvt = checkType('number', pvt);
        if (pvt > 0) {
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
};

module.exports = (router) => {
  router.options('/collect', cors(corsOptions));

  router.post('/collect', cors(corsOptions), collectRoute());
  router.get('/collect', cors(corsOptions), collectRoute());
};
