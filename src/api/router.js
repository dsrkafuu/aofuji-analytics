/* utils */
const { Router } = require('express');
const httpError = require('./utils/httpError');
const router = Router();
// db
const { mongoose } = require('./utils/mongoose');
router.use(mongoose());
const { User, Website } = require('./utils/mongoose');

/* middlewares */
// close db connection if serverless
if (process.env.SERVERLESS) {
  const closeConnection = require('./middlewares/closeConnection');
  router.use(closeConnection());
}

/* routes */

// collect route
require('./routes/collect')(router);

// init routes
router.get('/init', async (req, res) => {
  const results = await User.findOne({ username: 'admin' }, 'username').lean();
  res.send(results || { username: '' });
});
router.post('/init', async (req, res) => {
  const admin = await User.findOne({ username: 'admin' }, 'username').lean();
  if (admin) {
    res.status(400).send(httpError('No need to init user'));
  } else {
    let result = await User.create({
      username: 'admin',
      password: req.body.password,
      isAdmin: true,
    });
    result = result.toObject();
    delete result.password;
    res.status(201).send(result);
  }
});

// get all users
router.get('/users', async (req, res) => {
  const result = await User.find({}, 'username isAdmin').lean();
  res.send(result);
});
// [WIP] create a new user
router.post('/users', async (req, res) => {
  res.status(418).send(httpError('Feature not done yet'));
});
// change user password
router.put('/users/:id', async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, req.body).lean();
  delete result.password;
  res.send(result);
});

// get all websites
router.get('/websites', async (req, res) => {
  const result = await Website.find({}).lean();
  res.send(result);
});
// create a new websites
router.post('/websites', async (req, res) => {
  const result = await Website.create(req.body);
  res.send(result);
});

// fallbacks
require('./routes/fallback')(router);

module.exports = router;
