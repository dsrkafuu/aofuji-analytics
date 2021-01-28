const mongoose = require('mongoose');
const { buildError } = require('../utils/buildError.js');

// compile models
const Event = require('../models/Event.js')(mongoose);
const Session = require('../models/Session.js')(mongoose);
const Account = require('../models/Account.js')(mongoose);
const View = require('../models/View.js')(mongoose);
const Website = require('../models/Website.js')(mongoose);

// connect database
(function connectDB() {
  const dbURL = process.env.DATABASE_URL;
  if (!dbURL) {
    throw buildError(500, 'environment variable DATABASE_URL not set');
  }
  mongoose.set('returnOriginal', false);
  mongoose
    .connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .catch((e) => {
      console.error(e.stack);
      if (process.env.SERVERLESS) {
        throw buildError(500, 'mongoose connection failed');
      } else {
        setTimeout(() => {
          connectDB();
        }, 60 * 1000);
        throw buildError(500, 'mongoose connection failed');
      }
    });
})();

module.exports = {
  /**
   * mongoose middleware
   * @param {Object} req express request
   * @param {Object} req express response
   * @param {Function} req express next
   */
  mongoose: (req, res, next) => {
    req.mongoose = mongoose;
    next();
  },
  // models
  Event,
  Session,
  Account,
  View,
  Website,
  /**
   * select for `create()`
   * @param {Object} result mongoose document
   * @param {string} keys
   */
  select: (result, keys) => {
    let ret = result;
    ret.toObject && (ret = ret.toObject());
    keys = ['_id', ...(keys.split(' ') || [])];
    for (let key in ret) {
      if (!keys.includes(key)) {
        delete ret[key];
      }
    }
    return ret;
  },
};
