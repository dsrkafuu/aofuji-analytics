/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../utils/initEnv')(); // load env

/* init express instance */
const express = require('express');
const app = express();
const port = process.env.API_SERVER_PORT || 3001;

/* middlewares */
// vercel CDN
if (process.env.VERCEL) {
  const vercelCookie = require('./middlewares/vercelCookie');
  app.use(vercelCookie());
}

/* routes */
const router = require('./router');
app.use('/api', router);

/* port listening */
app.listen(port, () => {
  console.log(`[Goose API] Listening at http://localhost:${port}`);
});
