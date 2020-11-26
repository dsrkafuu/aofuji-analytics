const mongoose = require('mongoose');

/* connect database */
const dbURL = process.env.DATABASE_URL;
if (dbURL) {
  mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('error', () => {
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
    req.mongoose = mongoose;
    next();
  },
  // models
  User,
  Website,
};
