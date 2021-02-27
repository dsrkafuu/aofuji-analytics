const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const buildError = require('../utils/buildError');
const selectQuery = require('../utils/selectQuery');
const { Account } = require('../models');
const { JWT_DEFAULT_SECRET, COOKIE_TOKEN } = require('../utils/constants');
const SECRET = process.env.TOKEN_SECRET || JWT_DEFAULT_SECRET;

// check init status
router.get('/init', async (req, res) => {
  const inited = await Account.findOne({}).select('username').lean();
  res.set('Content-Length', 0);
  if (!inited) {
    res.status(201).send();
  }
  res.send();
});

// init admin
router.post('/init', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw buildError(400, 'init request unknown body');
  }
  let result = await Account.create({
    username,
    password,
    isAdmin: true,
  });
  res.status(201).send(selectQuery(result, 'username'));
});

// login route
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw buildError(400, 'login request unknown body');
  }

  // find user
  const account = await Account.findOne({ username }).select('+password').lean();
  if (!account) {
    throw buildError(403, 'wrong username or password');
  }

  // parallelly check password and gen token
  const checkPassword = async () => {
    const valid = bcrypt.compareSync(password, account.password);
    if (!valid) {
      throw buildError(403, 'wrong username or password');
    }
  };
  const genToken = async () => {
    const token = jwt.sign({ _id: account._id, username: account.username }, SECRET, {
      algorithm: 'HS256',
    });
    if (!token) {
      throw buildError(500, 'error generating jwt token');
    }
    return token;
  };
  const [, token] = await Promise.all([checkPassword(), genToken()]);

  // send token back
  res.cookie(COOKIE_TOKEN, token, { maxAge: 14 * 86400 * 1000, sameSite: 'Lax' });
  res.send(selectQuery(account, 'username'));
});

module.exports = router;
