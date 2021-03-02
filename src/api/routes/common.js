const { Router } = require('express');
const router = Router();

const { Website, Share } = require('../models');

router.get('/', async (req, res) => {
  // share mode
  const sid = req.query.share;
  if (sid) {
    const result = await Share.findById(sid)
      .select('_website expire')
      .populate('_website', 'name')
      .lean();
    res.send(result);
  }
  // common mode
  else {
    const result = await Website.find({}).select('name').limit(20).lean();
    res.send(result);
  }
});

module.exports = router;
