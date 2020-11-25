/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
const { Router } = require('express');

/* init sub router */
const router = Router();

/* basic routes */
router.get('/', async (req, res) => {
  res.send('Request get');
});

module.exports = router;
