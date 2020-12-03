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

/* fallbacks 403 */
router.get('/*', async (req, res) => {
  res.status(403).send(errorBuilder(403));
});

module.exports = router;
