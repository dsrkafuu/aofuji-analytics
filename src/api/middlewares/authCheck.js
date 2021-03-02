const jwt = require('jsonwebtoken');

const buildError = require('../utils/buildError');
const { Account, Share } = require('../models');
const { JWT_DEFAULT_SECRET, COOKIE_TOKEN } = require('../utils/constants');

const SECRET = process.env.TOKEN_SECRET || JWT_DEFAULT_SECRET;
const defaultOptions = {
  checkShare: false, // whether check `share` search param
};

function authCheck(options = defaultOptions) {
  const { checkShare } = { defaultOptions, ...options };
  return async (req, res, next) => {
    // routes that can be public and also passed `share` search param
    const { share } = req.query;
    if (checkShare && share) {
      const result = await Share.findById(share).select('expire').lean();
      if (result.expire < 0 || Date.now() < result.expire) {
        next();
      } else {
        throw buildError(403, 'expired or invalid share request');
      }
    } else {
      // check token
      const { [COOKIE_TOKEN]: token } = req.cookies;
      if (!token) {
        throw buildError(403, 'api request unauthorized');
      }
      // get token data
      let tokenData;
      try {
        tokenData = jwt.verify(token, SECRET, { algorithm: 'HS256' });
      } catch {
        tokenData = null;
      }
      if (!tokenData || !tokenData._id || !tokenData.username) {
        throw buildError(403, 'api request unauthorized');
      }
      // check user
      const { _id, username } = tokenData;
      let authed;
      try {
        const account = await Account.findById(_id).select('username').lean();
        authed = account.username === username;
      } catch {
        authed = false;
      }
      if (!authed) {
        throw buildError(403, 'api request unauthorized');
      }
      next();
    }
  };
}

module.exports = authCheck;
