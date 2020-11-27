const mongoose = require('mongoose');
const errorBuilder = require('./errorBuilder');

/* connect database */
async function connectDB() {
  const dbURL = process.env.DATABASE_URL;
  if (dbURL) {
    try {
      await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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
const User = require('../models/User')(mongoose);
const Website = require('../models/Website')(mongoose);

module.exports = {
  // mongoose instance middleware
  mongoose: () => async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      // respond 503 when database unavailable
      res.status(503).send(errorBuilder(503));
    } else {
      req.mongoose = mongoose;
      next();
    }
  },
  // models
  User,
  Website,
};
