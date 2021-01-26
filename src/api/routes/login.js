/* deps */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* utils */
const buildError = require('../utils/buildError.js');
const { User, select } = require('../utils/mongoose.js');

const selectKeys = 'username';

module.exports = (router) => {
  // check init status
  router.get('/init', async (req, res) => {
    const admin = await User.findOne({ username: 'admin' }).select(selectKeys).lean();
    if (admin) {
      res.send(admin); // no need to init
    } else {
      res.status(201).send({}); // need post to init admin user
    }
  });

  // init admin
  router.post('/init', async (req, res) => {
    const pw = req.body.pw;
    if (!pw) {
      throw buildError(400, 'init request unknown body');
    }
    let result = await User.create({
      username: 'admin',
      password: pw,
      isAdmin: true,
    });
    res.status(201).send(select(result, selectKeys));
  });

  // login route
  router.post('/login', async (req, res) => {
    // get password
    const pw = req.body.pw;
    if (!pw) {
      throw buildError(403, 'login request no password');
    }

    // find user
    const admin = await User.findOne({ username: 'admin' }).select('+password').lean();
    if (!admin) {
      throw buildError(403, 'wrong username or password');
    }

    // parallelly check password and gen token
    const checkPassword = async () => {
      const valid = bcrypt.compareSync(pw, admin.password);
      if (!valid) {
        throw buildError(403, 'wrong username or password');
      }
    };
    const genToken = async () => {
      const secret = process.env.JWT_SECRET || 'goose_jwt';
      const token = jwt.sign({ _id: admin._id }, secret, { algorithm: 'HS256' });
      if (!token) {
        throw buildError(500, 'error generating jwt token');
      }
      return token;
    };
    const [, token] = await Promise.all([checkPassword(), genToken()]);

    // send token back
    res.cookie('goose_token', token, { maxAge: 14 * 86400 * 1000, sameSite: 'Lax' });
    res.send(select(admin, selectKeys));
  });
};
