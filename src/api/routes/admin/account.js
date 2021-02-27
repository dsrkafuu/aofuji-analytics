const { Router } = require('express');
const router = Router();

const { Account } = require('../../models');

// get account
router.get('/', async (req, res) => {
  const result = await Account.findOne({}).select('username isAdmin').lean();
  res.send(result);
});

// modify account
router.put('/:id', async (req, res) => {
  const { username, password } = req.body;
  const result = await Account.findByIdAndUpdate(req.params.id, {
    username,
    password,
    isAdmin: true,
    _date: Date.now(),
  })
    .select('username isAdmin')
    .lean();
  res.status(201).send(result);
});

module.exports = router;
