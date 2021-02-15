/* deps */
const { Router } = require('express');
const router = Router();
const isLocalhost = require('is-localhost-ip');
const isBot = require('isbot');
const cors = require('cors');

/* utils */
const { requestIP } = require('../utils/requestIP.js');
const { buildError } = require('../utils/buildError.js');
const { formatQuery } = require('../utils/formatQuery.js');
const { formatPath } = require('../utils/formatPath.js');
const { formatRef } = require('../utils/formatRef.js');
const { Session, View, Website } = require('../utils/mongoose.js');
const { VIEW_EXPIRE_TIME, NEW_EXPIRE_TIME } = require('../utils/constants.js');

const route = async (req, res) => {
  // get basic params
  let { t: type, id, sid, d: date, p: path } = req.query;
  type = formatQuery('string', type);
  id = formatQuery('string', id);
  sid = formatQuery('string', sid);
  date = formatQuery('number', date);
  path = formatQuery('string', path);

  // origin check
  const origin = req.get('Origin');
  const checkOrigin = async () => {
    if (origin) {
      let result = false;
      try {
        const url = new URL(origin);
        result = await isLocalhost(url.hostname);
      } catch {
        result = true;
      }
      return !result;
    }
    return true;
  };
  // ip check
  const clientIP = requestIP(req);
  const checkIP = async () => {
    if (clientIP) {
      let result = false;
      try {
        result = await isLocalhost(clientIP);
      } catch {
        result = true;
      }
      return !result;
    }
    return true;
  };
  // bot check
  const clientUA = req.get('User-Agent');
  const checkBot = async () => {
    if (clientUA) {
      const result = isBot(clientUA);
      return !result;
    }
    return true;
  };
  if (process.env.NODE_ENV === 'production') {
    const [r1, r2, r3] = await Promise.all([checkOrigin(), checkIP(), checkBot()]);
    if (!(r1 && r2 && r3)) {
      res.set('Content-Length', 0);
      res.status(202).send();
      return; // remember to return
    }
  }

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
  let newSession = false;
  const initSession = async () => {
    let session = null;

    // find session
    if (sid) {
      try {
        session = await Session.findById(sid);
      } catch {
        session = null;
        if (clientIP) {
          try {
            session = await Session.findOne({ ip: clientIP });
          } catch {
            session = null;
          }
          !session && (session = null);
        }
      }
      !session && (session = null);
    } else if (clientIP) {
      try {
        session = await Session.findOne({ ip: clientIP });
      } catch {
        session = null;
      }
      !session && (session = null);
    }

    // change session data
    if (!session) {
      if (type === 'view') {
        session = await Session.create({ ip: clientIP, _date: date });
        newSession = true;
      } else {
        throw buildError(400, 'session init not allowed except view request');
      }
      return session;
    } else {
      if (date - session._date >= NEW_EXPIRE_TIME) {
        // view again after 1 day
        session.new && (session.new = false);
        session.ip = clientIP;
        session._date = date;
        await session.save();
      }
      return session;
    }
  };
  const [website, session] = await Promise.all([initWebsite(), initSession()]);
  console.log(session);

  // data process
  switch (type) {
    case 'view': {
      try {
        // get params
        let { r: ref, lng, scn } = req.query;
        ref = formatQuery('string', ref);
        lng = formatQuery('string', lng);
        scn = formatQuery('string', scn);
        const pathname = formatPath(path, website.base);
        const referrer = await formatRef(ref, website.url);

        // save view
        const saveView = async () => {
          // not create new view without referrer in 10 min
          const lastView = await View.findOne({
            _date: { $lt: date },
            _session: session._id,
            _website: website._id,
            pathname,
          }).sort({ _date: -1 });
          // no last view || after 10 min - save new view
          if (!lastView || date - lastView._date >= VIEW_EXPIRE_TIME) {
            const newView = {
              _date: date,
              _session: session._id,
              _website: website._id,
              pathname,
              referrer,
            };
            await View.create(newView);
          }
          // has last view && in 10 min - update view
          else {
            referrer && (lastView.referrer = referrer);
            lastView._date = date;
            await lastView.save();
          }
        };
        // save session
        const saveSession = async () => {
          // check whether need to try update session data
          let needSave = false;
          // language & screen
          if (newSession || !session.language || !session.screen) {
            lng && (session.language = lng);
            scn && (session.screen = scn);
            needSave = true;
          }
          // browser & system & platform
          if (newSession || !session.browser || !session.system || !session.platform) {
            const Bowser = require('bowser');
            const bowser = Bowser.getParser(clientUA);
            const formatString = (str) =>
              (str || '').toLowerCase().replace(/ +/gi, '-') || undefined;
            session.browser = formatString(bowser.getBrowserName());
            session.system = formatString(bowser.getOSName());
            session.platform = formatString(bowser.getPlatformType());
            needSave = true;
          }
          // location
          if (newSession || !session.location) {
            const path = require('path');
            const fs = require('fs');
            const { Reader } = require('maxmind');
            const gdb = fs.readFileSync(
              path.resolve(__dirname, '../../../api/assets/GeoLite2-Country.mmdb')
            );
            const maxmind = new Reader(gdb);
            if (clientIP) {
              const gd = maxmind.get(clientIP);
              session.location = gd && gd.country ? gd.country.iso_code : undefined;
              needSave = true;
            }
          }
          if (needSave) {
            await session.save();
          }
        };

        await Promise.all([saveView(), saveSession()]);
      } catch {
        throw buildError(500, 'error processing view data');
      }
      break;
    }

    case 'leave': {
      try {
        // get params
        let { pvt } = req.query;
        pvt = formatQuery('number', pvt);
        const pathname = formatPath(path, website.base);
        // update pvt to last view
        if (pvt > 0) {
          await View.findOneAndUpdate(
            // view before this leave
            {
              _date: { $lte: date },
              _session: session._id,
              _website: website._id,
              pathname,
            },
            // add new page view time (not replace)
            { $inc: { pvt } }
          )
            .sort({ _date: -1 }) // ensure first view before this leave
            .lean();
        }
      } catch {
        throw buildError(500, 'error processing leave data');
      }
      break;
    }

    default:
      throw buildError(400, 'request type not allowed');
  }

  // send response
  if (newSession) {
    res.status(201).send({ sid: session._id });
  } else {
    res.status(204).send();
  }
};

/* middlewares */
const options = {
  origin: true,
  methods: ['GET', 'POST'],
  credentials: false,
  maxAge: 86400, // 1 day
};

router.options('/', cors(options));
router.post('/', cors(options), route);
router.get('/', cors(options), route);

module.exports = { router };
