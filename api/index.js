/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../utils/env')(); // load env

/* init express instance */
const express = require('express');
const app = express();

/* middlewares */
// response time logger
const responseTime = require('./middlewares/responseTime');
app.use(responseTime());
// body parser
app.use(express.json());
// safety helmet
if (process.env.HELMET) {
  const helmet = require('helmet');
  app.use(helmet());
}
// vercel CDN
if (process.env.VERCEL) {
  const vercelCookie = require('./middlewares/vercelCookie');
  app.use(vercelCookie());
}

/* link database (only when requesting `/api`) */
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
