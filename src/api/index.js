/* utils */
const express = require('express');
const app = express();

/* middlewares */
// response time logger
app.use(require('./middlewares/responseTime.js')());
// body parser and cookie parser
app.use(express.json());
app.use(require('cookie-parser')());
// compression
app.use(require('compression')());
// [TODO] cache control
// if (process.env.VERCEL) {
//   app.use(require('./middlewares/cacheControl.js')());
// }

/* routes */
app.use('/api', require('./router.js'));
app.use(require('./middlewares/errorHandler.js')());

module.exports = app;
