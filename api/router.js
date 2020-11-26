/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
const { Router } = require('express');
const errorBuilder = require('./utils/errorBuilder');

/* init sub router */
const router = Router();

/* basic routes */
router.get('/', async (req, res) => {
  res.send('Request get');
});
router.get('/test', async (req, res) => {
  res.send('Test request get');
});

/* fallbacks 403 */
router.get('/*', async (req, res) => {
  res.status(403).send(errorBuilder(403));
});

module.exports = router;
