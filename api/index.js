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
  // static server
  // port listening
  const port = process.env.SERVER_PORT || 3000;
  app.listen(port, () => {
    console.log(`[Goose Analytics] Listening at http://localhost:${port}`);
  });
}
/* if serverless */
module.exports = app;
