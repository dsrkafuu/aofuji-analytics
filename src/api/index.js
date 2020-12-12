/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../../utils/env')();

/* init express instance */
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

// test
app.get('/api/test', async (req, res) => {
  const path = require('path');
  const fs = require('fs');
  let geoDBPath = path.resolve(__dirname, '../../api/assets/geolite/GeoLite2-Country.mmdb');
  console.log(fs.statSync(geoDBPath));
  const maxmind = require('maxmind');
  const lookup = await maxmind.open(geoDBPath);
  console.log(lookup.get('66.6.44.4'));
  console.log(lookup.getWithPrefixLength('66.6.44.4'));
  res.send({ status: 200 });
});

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
