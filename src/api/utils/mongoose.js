const mongoose = require('mongoose');
const httpError = require('./httpError');

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
        console.error('[Goose API] Mongoose connection failed');
      } else {
        console.error('[Goose API] Mongoose connection failed, try again after 1 minute');
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
const Event = require('../models/Event')(mongoose);
const Session = require('../models/Session')(mongoose);
const User = require('../models/User')(mongoose);
const View = require('../models/View')(mongoose);
const Website = require('../models/Website')(mongoose);

module.exports = {
  // mongoose instance middleware
  mongoose: () => async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      // respond 503 when database unavailable
      res.status(503).send(httpError('Database connection failed'));
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
