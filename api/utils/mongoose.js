const mongoose = require('mongoose');
const errorBuilder = require('./errorBuilder');

/* connect database */
const dbURL = process.env.DATABASE_URL;
if (dbURL) {
  mongoose
    .connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch(() => {
      console.error('[Goose API] Mongoose failed to connect to database');
    });
} else {
  console.error('[Goose API] Environment variable DATABASE_URL not set');
}

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
