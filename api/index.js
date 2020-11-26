/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../utils/initEnv')(); // load env

/* init express instance */
const express = require('express');
const app = express();

/* middlewares */
// vercel CDN
if (process.env.VERCEL) {
  const vercelCookie = require('./middlewares/vercelCookie');
  app.use(vercelCookie());
}

// link database
const { mongoose } = require('./utils/mongoose');
app.use(mongoose());

/* routes */
const router = require('./router');
app.use('/api', router);

/* if not serverless */
if (!process.env.SERVERLESS) {
  // static server in production
  if (process.env.NODE_ENV === 'production') {
    const staticServer = require('./utils/staticServer');
    staticServer(app);
  }
  // port listening
  const portListener = require('./utils/portListener');
  portListener(app);
}
/* if serverless */
module.exports = app;
