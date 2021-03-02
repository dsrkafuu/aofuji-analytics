const { Router } = require('express');
const router = Router();

const buildError = require('../../utils/buildError');
const selectQuery = require('../../utils/selectQuery');
const { Share, Account, Website } = require('../../models');

// get all sharing
router.get('/', async (req, res) => {
  const result = await Share.find({})
    .select('_website expire')
    .populate('_website', 'name')
    .limit(20)
    .lean();
  res.send(result);
});

// get one sharing
router.get('/:id', async (req, res) => {
  const result = await Share.findById(req.params.id)
    .select('_website expire')
    .populate('_website', 'name')
    .lean();
  res.send(result);
});

// create a new sharing
router.post('/', async (req, res) => {
  const { _website, expire } = req.body;
  const account = await Account.findOne({}).lean();
  if (account) {
    const result = await Share.create({
      _date: Date.now(),
      _account: account._id,
      _website,
      expire,
    });
    const body = selectQuery(result, '_website expire');
    const website = await Website.findById(body._website).select('name').lean();
    body._website = website;
    res.status(201).send(body);
  } else {
    throw buildError(403, 'share account not found');
  }
});

// delete a sharing
router.delete('/:id', async (req, res) => {
  await Share.findByIdAndDelete(req.params.id).lean();
  res.status(201).send();
});

module.exports = router;
