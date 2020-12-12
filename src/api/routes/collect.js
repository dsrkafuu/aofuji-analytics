/* utils */
const { v4 } = require('uuid');
const httpError = require('../utils/httpError');
// models
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
    } catch {
      return res.status(400).send(httpError('Request website not allowed'));
    }
    if (!website) {
      return res.status(400).send(httpError('Request website not allowed'));
    }
    // check whether is a exist session
    const uuid = req.cookies.goose_uuid || v4();
    let session = await Session.findOne({ uuid });
    if (!session) {
      session = await Session.create({ uuid, _date: date });
    }

    console.log();
    console.log('[WIP] TYPE:', type);
    console.log('[WIP] TIME:', date);
    console.log('[WIP] UUID:', uuid);
    console.log('[WIP] SITE:', website._id);
    console.log('[WIP] DATE:', data);
    console.log();
    // data process
    const works = [];

    switch (type) {
      case 'view': {
        // save view
        const newView = {
          _session: session._id,
          _website: website._id,
          pathname: data.path,
          referrer: data.ref,
        };
        date && (newView._date = date);
        works.push(View.create(newView));
        // check whether need to update session data
        if (data.sync) {
          session.language = data.lang;
          session.screen = data.scrn;
          // [WIP]
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
                // apply new page view time
                pvt: data.pvt,
              },
              {
                // first view before this leave
                sort: { _date: -1 },
              }
            )
          );
        }
        break;
      }
    }

    // send response
    await Promise.all(works);
    res.cookie('goose_uuid', uuid, { sameSite: 'lax' });
    res.status(204).send();
  });
};
