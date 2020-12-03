/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
const { Router } = require('express');
const errorBuilder = require('./utils/errorBuilder');

/* init sub router */
const router = Router();

/* link database */
const { mongoose } = require('./utils/mongoose');
router.use(mongoose());

/* load models */
const { User } = require('./utils/mongoose');

/* basic routes */
// get all users
router.get('/users', async (req, res) => {
  const result = await User.find({}, 'username password isAdmin').maxTimeMS(1000);
  res.send(result);
});
// create a new user
router.post('/users', async (req, res) => {
  // body fliter
  const { username, password, isAdmin } = req.body;
  const result = await User.create({ username, password, isAdmin });
  res.send(result);
});

// test
router.get('/test', async (req, res) => {
  const p = require('path').resolve(__dirname, '../../api/assets/GeoLite2-Country.mmdb');
  if (require('fs').existsSync(p)) {
    console.log(require('fs').readFileSync(p));
    res.send({ status: 'exists' });
  } else {
    res.send({ status: 'notfound' });
  }
});

/* fallbacks 403 */
router.get('/*', async (req, res) => {
  res.status(403).send(errorBuilder(403));
});

module.exports = router;
