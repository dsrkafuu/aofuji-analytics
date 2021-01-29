/* deps */
const { Router } = require('express');
const router = Router();

/* utils */
const { buildError } = require('./utils/buildError.js');
const { mongoose } = require('./utils/mongoose.js');
router.use(mongoose());

/* routes */
const { router: collect } = require('./routes/collect.js');
const { router: login } = require('./routes/login.js');
router.use('/collect', collect);
router.use('/login', login);
const { router: adminWebsite } = require('./routes/admin/website.js');
const { router: adminAccount } = require('./routes/admin/account.js');
const { router: adminDebug } = require('./routes/admin/debug.js');
router.use('/admin/website', adminWebsite);
router.use('/admin/account', adminAccount);
router.use('/admin/debug', adminDebug);

/* fallback */
router.use('/*', async () => {
  throw buildError(404, 'route not found');
});

module.exports = { router };
