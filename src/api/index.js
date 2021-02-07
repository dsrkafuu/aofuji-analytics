/*! vector-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

/* utils */
const express = require('express');
const app = express();

/* middlewares */
// response time logger
const { responseTime } = require('./middlewares/responseTime.js');
app.use(responseTime());
// body parser and cookie parser
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// compression
const compression = require('compression');
app.use(compression());

/* routes */
// route-level cache control
const { cacheControl } = require('./middlewares/cacheControl.js');
const { router } = require('./router.js');
app.use('/api', cacheControl(), router);
// transform error to http response
const { errorHandler } = require('./middlewares/errorHandler.js');
app.use(errorHandler());

module.exports = app;
