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

  // get steps
  let { step } = req.query;
  step = formatQuery('number', step);
  // [DEBUG]
  // from = 1612846112100; // 12:48:32
  // to = 1612846952100; // 13:02:32
  // step = 120000; // 2min

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
            // Session.estimatedDocumentCount()
            Session.countDocuments({ _date: { $lte: step.to, $gt: step.from }, _website: website })
          )
        );
        return res;
      };
      // group sessions by key
      const groupBy = (key) =>
        Session.aggregate([
          // from to
          { $match: { _date: { $lte: to, $gt: from }, _website: website } },
          // count each [key]'s total value
          { $group: { _id: key ? `$${key}` : null, value: { $sum: 1 } } },
          { $sort: { value: -1 } },
          { $limit: 10 },
        ]);

      sessions = await Promise.all([
        // sessions by step
        stepBy(),
        // datas
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
      // sessions by step
      ssum: sessions[0] || [],
      // datas
      lang: toPairs(sessions[1] || []),
      brow: toPairs(sessions[2] || []),
      sys: toPairs(sessions[3] || []),
      plat: toPairs(sessions[4] || []),
      loc: toPairs(sessions[5] || []),
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
        return res;
      };
      views = await Promise.all([stepBy()]);
    } catch {
      views = [];
    }
    return {
      // views counter
      vsum: views[0] || [],
    };
  };

  const [r1, r2] = await Promise.all([findSession(), findView()]);
  res.send({ ...r1, ...r2 });
});

module.exports = { router };
