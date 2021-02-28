/*! vector-analytics | DSRKafuU (https://dsrkafuu.su) | Copyright (c) MIT License */

// utils
const express = require('express');
const app = express();

// middlewares
// response time logger
const responseTime = require('./middlewares/responseTime');
app.use(responseTime());
// body parser and cookie parser
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// compression
const compression = require('compression');
app.use(compression());

// routes
app.use('/api', require('./router.js'));

// transform error to http response
const errorHandler = require('./middlewares/errorHandler.js');
app.use(errorHandler());

module.exports = app;
