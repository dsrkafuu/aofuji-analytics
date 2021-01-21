/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../utils/env.js')();

const app = require('../src/api/index.js');

/* normal */
if (!process.env.SERVERLESS) {
  // static server in production
  if (process.env.NODE_ENV === 'production') {
    const { static: serveStatic } = require('express');
    const history = require('connect-history-api-fallback');
    app.use(history());
    app.use(serveStatic('dist'));
  }
  // port listening
  const port =
    process.env.NODE_ENV === 'production'
      ? process.env.SERVER_PORT || 3000
      : process.env.SERVER_API_PORT || 3001;
  app.listen(port, () => {
    console.log(`[goose api] listening at http://localhost:${port}`);
  });
}

/* serverless */
module.exports = app;
