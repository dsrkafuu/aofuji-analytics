/* deps */
const { Router } = require('express');
const router = Router();

/* utils */
const { Website } = require('../utils/mongoose.js');

const selectKeys = 'name';

router.get('/', async (req, res) => {
  const result = await Website.find({}).select(selectKeys).limit(50).lean();
  res.send(result);
});

module.exports = { router };
