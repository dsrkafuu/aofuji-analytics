/* utils */
const { Router } = require('express');
const router = Router();
const { buildError } = require('../../utils/buildError.js');
const { Website, Account, select } = require('../../utils/mongoose.js');

const selectKeys = 'name url base isPublic';

// get all websites
router.get('/', async (req, res) => {
  const result = await Website.find({}).select(selectKeys).limit(50).lean();
  res.send(result);
});

// get one website
router.get('/:id', async (req, res) => {
  const result = await Website.findById(req.params.id).select(selectKeys).lean();
  res.send(result);
});

// create a new website
router.post('/', async (req, res) => {
  const { name, url, base, isPublic } = req.body;
  const account = await Account.findOne({}).lean();
  if (account) {
    const result = await Website.create({
      _account: account._id,
      name,
      url,
      base,
      isPublic,
      _date: Date.now(),
    });
    res.status(201).send(select(result, selectKeys));
  } else {
    throw buildError(403, 'website account not found');
  }
});

// modify a website
router.put('/:id', async (req, res) => {
  const { name, url, base, isPublic } = req.body;
  const result = await Website.findByIdAndUpdate(req.params.id, {
    name,
    url,
    base,
    isPublic,
    _date: Date.now(),
  })
    .select(selectKeys)
    .lean();
  res.status(201).send(result);
});

// delete a website
router.delete('/:id', async (req, res) => {
  await Website.findByIdAndDelete(req.params.id).lean();
  res.status(201).send();
});

module.exports = { router };
