/* deps */
const { Router } = require('express');
const router = Router();

/* utils */
const { buildError } = require('./utils/buildError.js');
const { mongoose } = require('./utils/mongoose.js');
router.use(mongoose());

/* middlewares */
const { authCheck } = require('./middlewares/authCheck.js');

/* routes */
const { router: collect } = require('./routes/collect.js');
const { router: login } = require('./routes/login.js');
const { router: common } = require('./routes/common.js');
router.use('/collect', collect);
router.use('/login', login);
router.use('/common', /*authCheck({ checkPublic: true }),*/ common);
const { router: adminWebsite } = require('./routes/admin/website.js');
const { router: adminAccount } = require('./routes/admin/account.js');
const { router: adminDebug } = require('./routes/admin/debug.js');
router.use('/admin/website', authCheck(), adminWebsite);
router.use('/admin/account', authCheck(), adminAccount);
router.use('/admin/debug', authCheck(), adminDebug);

/* fallback */
router.use('/*', async () => {
  throw buildError(404, 'route not found');
});

module.exports = { router };
