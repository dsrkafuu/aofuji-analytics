/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../../utils/env')();

/* utils */
const express = require('express');
const app = express();

/* middlewares */
// response time logger
app.use(require('./middlewares/responseTime.js')());
// body parser and cookie parser
app.use(express.json());
app.use(require('cookie-parser')());
// compression
if (process.env.NODE_ENV === 'production') {
  app.use(require('compression')());
}
// safety helmet
if (process.env.HELMET) {
  app.use(require('helmet')());
}
// vercel CDN
if (process.env.VERCEL) {
  app.use(require('./middlewares/vercelCookie')());
}

/* routes */
app.use('/api', require('./router'));

/* server */
if (!process.env.SERVERLESS) {
  // static server in production
  if (process.env.NODE_ENV === 'production') {
    require('./utils/staticServer')(app);
  }
  // port listening
  require('./utils/portListener')(app);
}
// if serverless
module.exports = app;
