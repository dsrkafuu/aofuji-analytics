const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { View, Session } = require('../../models');
const buildError = require('../../utils/buildError');
const formatQuery = require('../../utils/formatQuery');
const toPairs = require('../../utils/toPairs');

router.get('/', async (req, res) => {
  // get request time
  let { from, to } = req.query;
  from = formatQuery('number', from);
  to = formatQuery('number', to);

  // construct steps
  let { step } = req.query;
  step = formatQuery('number', step);

  let fromTemp = to - step;
  const steps = [{ from: fromTemp, to: to }];
  while (fromTemp > from) {
    fromTemp = steps[0].from - step;
    steps.unshift({ from: fromTemp, to: steps[0].from });
  }

  // get selected website
  let { website } = req.query;
  website = new ObjectId(formatQuery('string', website));
  if (!website) {
    throw buildError(400, 'missing request query');
  }

  const findSession = async () => {
    let sessions;
    try {
      // count sessions by step
      const countSess = async () => {
        const res = await Session.countDocuments({
          _date: { $lte: to, $gt: from },
          _website: website,
        }); // Session.estimatedDocumentCount()
        return Number(res) || 0;
      };
      // group sessions by key
      const group = async (key) => {
        const res = await Session.aggregate([
          { $match: { _date: { $lte: to, $gt: from }, _website: website } }, // from to
          { $group: { _id: `$${key}`, value: { $sum: 1 } } }, // count each [key]'s total value
          { $sort: { value: -1 } },
          { $limit: 10 },
        ]);
        return toPairs(res || []);
      };
      sessions = await Promise.all([
        countSess(),
        group('language'),
        group('browser'),
        group('system'),
        group('platform'),
        group('location'),
      ]);
    } catch {
      sessions = [];
    }
    return {
      us: sessions[0], // unique user sessions
      lang: sessions[1],
      brow: sessions[2],
      sys: sessions[3],
      plat: sessions[4],
      loc: sessions[5],
    };
  };

  const findView = async () => {
    let views;
    try {
      // count views by step
      const stepViews = async () => {
        let res = await Promise.all(
          steps.map((step) =>
            View.countDocuments({
              _date: { $lte: step.to, $gt: step.from },
              _website: website,
            })
          )
        );
        return res || [];
      };
      // count unique visitors by step
      const stepVisitors = async () => {
        let res = await Promise.all(
          steps.map(async (step) => {
            const d = await View.distinct('_session', {
              _date: { $lte: step.to, $gt: step.from },
              _website: website,
            });
            return d.length || 0;
          })
        );
        return res || [];
      };
      // group views by pathname
      const groupPaths = async () => {
        const res = await View.aggregate([
          { $match: { _date: { $lte: to, $gt: from }, _website: website } },
          { $group: { _id: '$pathname', value: { $sum: 1 } } },
          { $sort: { value: -1 } },
          { $limit: 10 },
        ]);
        return toPairs(res || []);
      };
      // group views by referrer
      const groupRefs = async () => {
        const res = await View.aggregate([
          {
            $match: {
              _date: { $lte: to, $gt: from },
              _website: website,
              referrer: { $exists: true },
            },
          },
          { $group: { _id: '$referrer', value: { $sum: 1 } } },
          { $sort: { value: -1 } },
          { $limit: 10 },
        ]);
        return toPairs(res || []);
      };
      // count avg view time by key
      const avgViewTime = async () => {
        const res = await View.aggregate([
          { $match: { _date: { $lte: to, $gt: from }, _website: website, pvt: { $gt: 0 } } },
          { $group: { _id: null, value: { $avg: '$pvt' } } },
        ]);
        return (res || [])[0]?.value || 0;
      };
      views = await Promise.all([
        stepViews(),
        stepVisitors(),
        groupPaths(),
        groupRefs(),
        avgViewTime(),
      ]);
    } catch {
      views = [];
    }
    return {
      pv: views[0].reduce((preVal, curVal) => preVal + curVal, 0), // total page views
      pvs: views[0], // page views by step
      uss: views[1], // sessions by step
      path: views[2],
      ref: views[3],
      pvt: views[4], // average page view time
    };
  };

  const [r1, r2] = await Promise.all([findSession(), findView()]);
  res.send({ ...r1, ...r2 });
});

module.exports = router;
