/* utils */
const express = require('express');
const app = express();

/* middlewares */
// response time logger
const { responseTime } = require('./middlewares/responseTime.js');
app.use(responseTime);
// body parser and cookie parser
app.use(express.json());
app.use(require('cookie-parser')());
// compression
app.use(require('compression')());
// cache control
const { cacheControl } = require('./middlewares/cacheControl.js');
app.use(cacheControl);

/* routes */
const { router } = require('./router.js');
app.use('/api', router);

const { errorHandler } = require('./middlewares/errorHandler.js');
app.use(errorHandler);

module.exports = app;
