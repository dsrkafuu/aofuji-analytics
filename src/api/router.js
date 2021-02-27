const { Router } = require('express');
const router = Router();

// utils
require('./utils/mongoose');
const buildError = require('./utils/buildError');

// middlewares
const authCheck = require('./middlewares/authCheck');
const cacheControl = require('./middlewares/cacheControl');

// routes
router.use('/collect', cacheControl(), require('./routes/collect'));
router.use('/login', cacheControl(), require('./routes/login'));
router.use(
  '/common',
  cacheControl(),
  /*authCheck({ checkPublic: true }),*/ require('./routes/common')
);

router.use('/admin/website', cacheControl(), authCheck(), require('./routes/admin/website'));
router.use('/admin/account', cacheControl(), authCheck(), require('./routes/admin/account'));
router.use('/admin/debug', cacheControl(), authCheck(), require('./routes/admin/debug'));

router.use(
  '/metrics/dashboard',
  cacheControl({ allowCache: true }),
  require('./routes/metrics/dashboard')
);
router.use(
  '/metrics/realtime',
  cacheControl({ allowCache: true }),
  require('./routes/metrics/realtime')
);

// fallback
router.use('/*', async () => {
  throw buildError(404, 'route not found');
});

module.exports = router;
