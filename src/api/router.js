/* deps */
const { Router } = require('express');
const router = Router();

/* utils */
const { buildError } = require('./utils/buildError.js');
const { mongoose } = require('./utils/mongoose.js');
router.use(mongoose());

/* middlewares */
const { authCheck } = require('./middlewares/authCheck.js');
const { cacheControl } = require('./middlewares/cacheControl.js');

/* routes */
const { router: collect } = require('./routes/collect.js');
const { router: login } = require('./routes/login.js');
const { router: common } = require('./routes/common.js');
router.use('/collect', cacheControl(), collect);
router.use('/login', cacheControl(), login);
router.use('/common', cacheControl(), /*authCheck({ checkPublic: true }),*/ common);
const { router: adminWebsite } = require('./routes/admin/website.js');
const { router: adminAccount } = require('./routes/admin/account.js');
const { router: adminDebug } = require('./routes/admin/debug.js');
router.use('/admin/website', cacheControl(), authCheck(), adminWebsite);
router.use('/admin/account', cacheControl(), authCheck(), adminAccount);
router.use('/admin/debug', cacheControl(), authCheck(), adminDebug);
const { router: metricsRealtime } = require('./routes/metrics/realtime.js');
router.use('/metrics/realtime', cacheControl({ allowCache: true }), metricsRealtime);

/* fallback */
router.use('/*', async () => {
  throw buildError(404, 'route not found');
});

module.exports = { router };
