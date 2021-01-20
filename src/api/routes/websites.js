/* utils */
const { Website } = require('../utils/mongoose');

module.exports = (router) => {
  // get all websites
  router.get('/websites', async (req, res) => {
    const result = await Website.find({}).lean();
    res.send(result);
  });

  // create a new websites
  router.post('/websites', async (req, res) => {
    const result = await Website.create(req.body);
    res.send(result);
  });
};
