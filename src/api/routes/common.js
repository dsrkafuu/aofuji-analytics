const { Router } = require('express');
const router = Router();

const { Website } = require('../models');

router.get('/', async (req, res) => {
  const result = await Website.find({}).select('name').limit(20).lean();
  res.send(result);
});

module.exports = router;
