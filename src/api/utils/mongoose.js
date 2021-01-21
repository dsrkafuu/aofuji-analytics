const mongoose = require('mongoose');

/* connect database */
async function connectDB() {
  const dbURL = process.env.DATABASE_URL;
  if (dbURL) {
    try {
      await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
    } catch {
      if (process.env.SERVERLESS) {
        console.error('[goose api] mongoose connection failed');
      } else {
        console.error('[goose api] mongoose connection failed, try again after 1 minute');
        setTimeout(() => {
          connectDB();
        }, 60 * 1000);
      }
    }
  } else {
    console.error('[Goose API] Environment variable DATABASE_URL not set');
  }
}
connectDB();

/* compile models */
const Event = require('../models/Event.js')(mongoose);
const Session = require('../models/Session.js')(mongoose);
const User = require('../models/User.js')(mongoose);
const View = require('../models/View.js')(mongoose);
const Website = require('../models/Website.js')(mongoose);

module.exports = {
  // mongoose instance middleware
  mongoose: () => async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      // respond 503 when database unavailable
      const err = new Error('database connection failed');
      err.status = 503;
      throw err;
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
