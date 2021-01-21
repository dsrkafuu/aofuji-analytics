/* utils */
const { Router } = require('express');
const router = Router();
const buildError = require('./utils/buildError.js');
const { mongoose } = require('./utils/mongoose.js');
router.use(mongoose());

/* routes */
// collect route
require('./routes/collect.js')(router);

const { User } = require('./utils/mongoose.js');
// init routes
router.get('/init', async (req, res) => {
  const results = await User.findOne({ username: 'admin' }, 'username').lean();
  res.send(results || { username: '' });
});
router.post('/init', async (req, res) => {
  const admin = await User.findOne({ username: 'admin' }, 'username').lean();
  if (admin) {
    res.status(400).send('No need to init user');
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
  res.status(418).send('Feature not done yet');
});
// change user password
router.put('/users/:id', async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, req.body).lean();
  delete result.password;
  res.send(result);
});

// websites
require('./routes/websites.js')(router);
// debug
require('./routes/debug.js')(router);

/* fallback */
router.get('/*', async () => {
  throw buildError(404, 'route not found');
});
router.use(require('./middlewares/errorHandler.js')());

module.exports = router;
