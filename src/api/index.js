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
// cache control
const { cacheControl } = require('./middlewares/cacheControl.js');
app.use(cacheControl());

/* routes */
const { router } = require('./router.js');
app.use('/api', router);
const { errorHandler } = require('./middlewares/errorHandler.js');
app.use(errorHandler());

module.exports = app;
