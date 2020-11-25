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

/* routes */
const router = require('./router');
app.use('/api', router);

/* if not serverless */
if (!process.env.SERVERLESS) {
  // static server in production
  if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    const history = require('connect-history-api-fallback');
    app.use(history(), express.static(path.resolve('./dist')));
  }
  // port listening
  const port =
    process.env.NODE_ENV === 'production'
      ? process.env.SERVER_PORT || 3000
      : process.env.API_SERVER_PORT || 3001;
  app.listen(port, () => {
    console.log(
      `[Goose ${process.env.NODE_ENV === 'production' ? 'Analytics' : 'Dev API' || 3001}]`,
      `Listening at http://localhost:${port}`
    );
  });
}
/* if serverless */
module.exports = app;
