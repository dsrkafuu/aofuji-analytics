/* deps */
const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { View, Session } = require('../../utils/mongoose.js');

/* utils */
const { buildError } = require('../../utils/buildError.js');
const { formatQuery } = require('../../utils/formatQuery.js');
const { toPairs } = require('../../utils/toPairs.js');

router.get('/', async (req, res) => {
  // get request time
  let { from, to } = req.query;
  from = formatQuery('number', from);
  to = formatQuery('number', to);

  // construct steps
  let { step } = req.query;
  step = formatQuery('number', step);
  // [DEBUG]
  from = 1612846112100; // 12:48:32
  to = 1612846952100; // 13:02:32
  step = 120000; // 2min

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
      const stepBy = async () => {
        let res = await Promise.all(
          steps.map((step) =>
            Session.countDocuments({ _date: { $lte: step.to, $gt: step.from }, _website: website })
          ) // Session.estimatedDocumentCount()
        );
        return res || [];
      };
      // group sessions by key
      const groupBy = async (key) => {
        const res = await Session.aggregate([
          { $match: { _date: { $lte: to, $gt: from }, _website: website } }, // from to
          { $group: { _id: `$${key}`, value: { $sum: 1 } } }, // count each [key]'s total value
          { $sort: { value: -1 } },
          { $limit: 10 },
        ]);
        return toPairs(res || []);
      };

      sessions = await Promise.all([
        stepBy(),
        groupBy('language'),
        groupBy('browser'),
        groupBy('system'),
        groupBy('platform'),
        groupBy('location'),
      ]);
    } catch {
      sessions = [];
    }
    return {
      ssum: sessions[0], // sessions by step
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
      const stepBy = async () => {
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
      // group views by pathname
      const groupByPath = async () => {
        const res = await View.aggregate([
          { $match: { _date: { $lte: to, $gt: from }, _website: website } },
          { $group: { _id: '$pathname', value: { $sum: 1 } } },
          { $sort: { value: -1 } },
          { $limit: 10 },
        ]);
        return toPairs(res || []);
      };
      // group views by referrer
      const groupByRef = async () => {
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
      const avgByPVT = async () => {
        const res = await View.aggregate([
          { $match: { _date: { $lte: to, $gt: from }, _website: website, pvt: { $gt: 0 } } },
          { $group: { _id: null, value: { $avg: '$pvt' } } },
        ]);
        return (res || [])[0]?.value || 0;
      };

      views = await Promise.all([stepBy(), groupByPath(), groupByRef(), avgByPVT()]);
    } catch {
      views = [];
    }
    return {
      vsum: views[0], // views by step
      path: views[1],
      ref: views[2],
      pvt: views[3],
    };
  };

  const [r1, r2] = await Promise.all([findSession(), findView()]);
  res.send({ ...r1, ...r2 });
});

module.exports = { router };
