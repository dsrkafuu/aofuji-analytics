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
const { router } = require('./router.js');
app.use('/api', router);
// transform error to http response
const { errorHandler } = require('./middlewares/errorHandler.js');
app.use(errorHandler());

module.exports = app;
