/* utils */
const buildError = require('../utils/buildError.js');
const { User } = require('../utils/mongoose.js');

const selectKeys = 'username isAdmin';

module.exports = (router) => {
  // get all users
  router.get('/user', async (req, res) => {
    const result = await User.find({}).select(selectKeys).limit(10).lean();
    res.send(result);
  });

  // [TODO] get one users
  router.get('/user/:id', async () => {
    throw buildError(418, 'feature not done yet');
  });

  // [TODO] create a new user
  router.post('/user', async () => {
    throw buildError(418, 'feature not done yet');
  });

  // modify a user
  router.put('/user/:id', async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const result = await User.findByIdAndUpdate(req.params.id, {
      username,
      password,
      isAdmin,
      _date: Date.now(),
    })
      .select(selectKeys)
      .lean();
    res.status(201).send(result);
  });

  // [TODO] delete a user
  router.delete('/user/:id', async () => {
    throw buildError(418, 'feature not done yet');
  });
};
