const mongoose = require('mongoose');
const buildError = require('../utils/buildError.js');

/* compile models */
const Event = require('../models/Event.js')(mongoose);
const Session = require('../models/Session.js')(mongoose);
const User = require('../models/User.js')(mongoose);
const View = require('../models/View.js')(mongoose);
const Website = require('../models/Website.js')(mongoose);

/* connect database */
(function connectDB() {
  const dbURL = process.env.DATABASE_URL;
  if (!dbURL) {
    console.error('[goose api] environment variable DATABASE_URL not set');
    return;
  }
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
        console.error('[goose api] mongoose connection failed');
      } else {
        console.error('[goose api] mongoose connection failed, try again after 1 minute');
        setTimeout(() => {
          connectDB();
        }, 60 * 1000);
      }
    });
})();

module.exports = {
  // mongoose instance middleware
  mongoose: () => async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      // respond 503 when database unavailable
      throw buildError(503, 'database connection failed');
    } else {
      req.mongoose = mongoose;
      next();
    }
  },
  // models
  Event,
  Session,
  User,
  View,
  Website,
};
