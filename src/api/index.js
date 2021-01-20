/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../../utils/env')();

/* utils */
const express = require('express');
const app = express();

/* middlewares */
// response time logger
const responseTime = require('./middlewares/responseTime');
app.use(responseTime());
// body parser and cookie parser
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// compression
if (process.env.NODE_ENV === 'production') {
  const compression = require('compression');
  app.use(compression());
}
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

/* routes */
const router = require('./router');
app.use('/api', router);

/* server */
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
// if serverless
module.exports = app;
