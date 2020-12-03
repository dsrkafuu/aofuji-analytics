/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../../utils/env')();

/* init express instance */
const express = require('express');
const app = express();

/* middlewares */
// response time logger
const responseTime = require('./middlewares/responseTime');
app.use(responseTime());
// body parser
app.use(express.json());
// compression
if (process.env.NODE_ENV === 'production') {
  const compression = require('compression');
  app.use(compression());
}
// safety helmet
if (process.env.HELMET) {
  const helmet = require('helmet');
  app.use(helmet());
  console.log('[Goose Analytics] Helmet is securing the server which needs an HTTPS connection');
}
// vercel CDN
if (process.env.VERCEL) {
  const vercelCookie = require('./middlewares/vercelCookie');
  app.use(vercelCookie());
}

// test
app.get('/api/test', async (req, res) => {
  const p = require('path').resolve(__dirname, '../../api/assets/GeoLite2-Country.mmdb');
  if (require('fs').existsSync(p)) {
    console.log(require('fs').readFileSync(p));
    res.send({ status: 'exists' });
  } else {
    res.send({ status: 'notfound' });
  }
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
