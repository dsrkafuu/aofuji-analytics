/* deps */
const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { View, Event, Session } = require('../../utils/mongoose.js');

/* utils */
const { buildError } = require('../../utils/buildError.js');
const { formatQuery } = require('../../utils/formatQuery.js');
const { mapArray } = require('../../utils/mapArray.js');
const { toPairs } = require('../../utils/toPairs.js');
const { VIEW_EXPIRE_TIME } = require('../../utils/constants.js');

// get account
router.get('/', async (req, res) => {
  // [DEBUG]
  // const now = 1612846952200;
  const now = Date.now();

  // get selected website
  let { website } = req.query;
  website = new ObjectId(formatQuery('string', website));
  if (!website) {
    throw buildError(400, 'missing request query');
  }

  const findSession = async () => {
    let views, sessions;
    try {
      views = await View.find({
        _date: { $lte: now, $gt: now - VIEW_EXPIRE_TIME },
        _website: website,
      })
        .distinct('_session')
        .lean();
      sessions = await Session.find({
        _id: { $in: views },
      })
        .select('location platform')
        .lean();
    } catch {
      views = [];
      sessions = [];
    }
    return {
      au: views.length, // active users
      dc: mapArray(sessions, 'platform'), // device categories
      ur: mapArray(sessions, 'location'), // user regions
    };
  };

  const findView = async () => {
    let views;
    try {
      views = await View.aggregate([
        // in 10 min
        { $match: { _date: { $lte: now, $gt: now - VIEW_EXPIRE_TIME }, _website: website } },
        // count each path's total value
        { $group: { _id: '$pathname', value: { $sum: 1 } } },
        { $sort: { value: -1 } },
        { $limit: 10 },
      ]);
    } catch {
      views = [];
    }
    return {
      pv: toPairs(views), // page views
    };
  };

  const findEvent = async () => {
    let events;
    try {
      events = await Event.aggregate([
        // in 10 min
        { $match: { _date: { $lte: now, $gt: now - VIEW_EXPIRE_TIME }, _website: website } },
        // count each event's total value
        { $group: { _id: '$name', value: { $sum: 1 } } },
        { $sort: { value: -1 } },
        { $limit: 10 },
      ]);
    } catch {
      events = [];
    }
    return {
      ue: toPairs(events), // user events
    };
  };

  const [r1, r2, r3] = await Promise.all([findSession(), findView(), findEvent()]);
  res.send({ ...r1, ...r2, ...r3 });
});

module.exports = { router };
