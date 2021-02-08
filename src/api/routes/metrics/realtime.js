/* deps */
const { Router } = require('express');
const router = Router();

/* utils */
const { buildError } = require('../../utils/buildError.js');
const { formatQuery } = require('../../utils/formatQuery.js');
const { mapArray } = require('../../utils/mapArray.js');
const { View } = require('../../utils/mongoose.js');

const selectKeys = '_session pathname referrer pvt _date';
const populateKeys = '_session';
const selectPopulateKeys = 'platform location';

// get account
router.get('/', async (req, res) => {
  // get selected website
  let { website } = req.query;
  website = formatQuery('string', website);
  if (!website) {
    throw buildError(400, 'missing request query');
  }

  // find views in 15 min
  let views;
  try {
    // [DEBUG]
    // const now = 1612763153896;
    // [DEBUG]
    const now = Date.now();
    views = await View.find({
      _date: { $lte: now, $gt: now - 15 * 60 * 1000 },
      _website: website,
    })
      .select(selectKeys)
      .sort({ _date: -1 })
      .populate(populateKeys, selectPopulateKeys)
      .lean();
  } catch {
    views = [];
  }
  // filter view with session
  const filtered = [];
  const sessions = new Set();
  views.forEach((view) => {
    const session = view._session._id;
    if (!sessions.has(session)) {
      filtered.push(view);
      sessions.add(session);
    }
  });

  // device category
  const platforms = ['tablet', 'mobile', 'desktop', 'tv'];
  const dc = {};
  platforms.forEach((plat) => {
    dc[plat] = 0;
  });
  // map location
  const map = {};
  // page views and user sources
  const pv = new Map();
  const us = new Map();

  filtered.forEach((view) => {
    // device category
    const plat = view._session.platform;
    if (plat && platforms.includes(plat)) {
      dc[plat]++;
    }
    // map location
    const loc = view._session.location;
    if (loc) {
      map[loc] ? map[loc]++ : (map[loc] = 1);
    }
    // page views and user sources
    const path = view.pathname;
    pv.has(path) ? pv.set(path, pv.get(path) + 1) : pv.set(path, 1);
    const src = view.referrer || 'direct';
    us.has(src) ? us.set(src, us.get(src) + 1) : us.set(src, 1);
    delete view._id;
    delete view._session;
  });

  const realtime = {};
  realtime.uo = filtered.length;
  realtime.dc = dc;
  realtime.map = map;
  realtime.act = filtered;
  realtime.pv = mapArray(pv);
  realtime.us = mapArray(us);
  res.send(realtime);
});

module.exports = { router };
