/* deps */
const isLocalhost = require('is-localhost-ip');
const isBot = require('isbot');

/* utils */
const requestIP = require('../utils/requestIP.js');
const buildError = require('../utils/buildError.js');
const { formatQuery } = require('../utils/formatQuery.js');
const { formatPath } = require('../utils/formatPath.js');
const { formatRef } = require('../utils/formatRef.js');
const { Session, View, Website } = require('../utils/mongoose.js');

/* middlewares */
const cors = require('cors')({
  origin: true,
  methods: ['GET', 'POST'],
  credentials: false,
  maxAge: 86400, // 1 day
});

const collectRoute = async (req, res) => {
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
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    if (origin) {
      let result = false;
      try {
        const url = new URL(origin);
        result = await isLocalhost(url.hostname);
      } catch {
        result = true;
      }
      if (result) {
        res.status(202).send();
      }
    }
  };
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
  await Promise.all([checkOrigin(), checkIP(), checkBot()]);

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
  const [website, session] = await Promise.all([initWebsite(), initSession()]);

  try {
    // data process
    switch (type) {
      case 'view': {
        const works = [];
        // get params
        let { r: ref, lng, scn } = req.query;
        ref = formatQuery('string', ref);
        lng = formatQuery('string', lng);
        scn = formatQuery('string', scn);
        // not add same page view from same user in 10 minute
        const lastView = await View.findOne({
          _date: { $lt: date },
          _session: session._id,
          _website: website._id,
          pathname: formatPath(path, website.base),
        })
          .sort({ _date: -1 })
          .lean();
        if (!lastView || date - lastView._date > 600 * 1000) {
          // save view
          const newView = {
            _date: date,
            _session: session._id,
            _website: website._id,
            pathname: formatPath(path, website.base),
            referrer: formatRef(ref, website.url),
          };
          works.push(View.create(newView));
        }
        // check whether need to update session data
        if (needNewSession || lng || scn) {
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
          session.language = lng;
          session.screen = scn;
          // browser & system & platform
          const bowser = Bowser.parse(clientUA);
          const formatBowser = (str) => (str || '').toLowerCase().replace(/ +/gi, '-') || undefined;
          session.browser = formatBowser(bowser.browser.name);
          session.system = formatBowser(bowser.os.name);
          session.platform = formatBowser(bowser.platform.type);
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
        pvt = formatQuery('number', pvt);
        if (pvt > 0) {
          // update pvt to last view
          await View.findOneAndUpdate(
            // view before this leave
            {
              _date: { $lt: date },
              _session: session._id,
              _website: website._id,
              pathname: formatPath(path, website.base),
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
  router.options('/collect', cors);
  router.post('/collect', cors, collectRoute);
  router.get('/collect', cors, collectRoute);
};
