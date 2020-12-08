const { Router } = require('express');
const httpError = require('./utils/httpError');

/* init sub router */
const router = Router();

/* link database */
const { mongoose } = require('./utils/mongoose');
router.use(mongoose());

/* load models */
const { Event, Session, User, View, Website } = require('./utils/mongoose');

/* route level middleware */
// close db connection if serverless
if (process.env.SERVERLESS) {
  const closeConnection = require('./middlewares/closeConnection');
  router.use(closeConnection());
}
// collect route cors
const cors = require('cors');
const corsOptions = {
  origin: true,
  methods: 'POST',
  credentials: true,
  maxAge: 86400,
};

/* collect route */
router.options('/collect', cors(corsOptions));
router.post('/collect', cors(corsOptions), async (req, res) => {
  console.log('[WIP] GET COLLECT REQUEST', req.body);
  res.status(204).send();
});

/* basic routes */

// init routes
router.get('/init', async (req, res) => {
  const results = await User.find({ username: 'admin' }, 'username').lean();
  res.send(results[0] || {});
});
router.post('/init', async (req, res) => {
  const admin = await User.find({ username: 'admin' }, 'username').lean();
  if (admin && admin[0]) {
    res.status(403).send(httpError('No need to init'));
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
  const result = await Website.find({});
  res.send(result);
});
// create a new websites
router.post('/websites', async (req, res) => {
  const result = await Website.create(req.body);
  res.send(result);
});

/* fallbacks */
router.get('/*', async (req, res) => {
  res.status(404).send(httpError('Route not found'));
});

module.exports = router;
