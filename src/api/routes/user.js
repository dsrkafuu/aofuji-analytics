/* utils */
const buildError = require('../utils/buildError.js');
const { User } = require('../utils/mongoose.js');

module.exports = (router) => {
  // init routes
  router.get('/init', async (req, res) => {
    const admin = await User.findOne({ username: 'admin' }).lean();
    if (admin) {
      throw buildError(400, 'no need to init admin');
    } else {
      let result = await User.create({
        username: 'admin',
        password: '123456',
        isAdmin: true,
      });
      result = result.toObject();
      delete result.password;
      res.status(201).send(result);
    }
  });

  // get all users
  router.get('/user', async (req, res) => {
    const result = await User.find({}, 'username isAdmin').lean();
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
    }).lean();
    res.status(201).send(result);
    delete result.password;
    res.send(result);
  });

  // [TODO] delete a user
  router.delete('/user/:id', async () => {
    throw buildError(418, 'feature not done yet');
  });
};
