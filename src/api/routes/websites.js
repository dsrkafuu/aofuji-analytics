/* utils */
const { Website } = require('../utils/mongoose');

module.exports = (router) => {
  // get all websites
  router.get('/website', async (req, res) => {
    const result = await Website.find({}).lean();
    res.send(result);
  });

  // get one website
  router.get('/website/:id', async (req, res) => {
    const result = await Website.findById(req.params.id).lean();
    res.send(result);
  });

  // create a new websites
  router.post('/website', async (req, res) => {
    const result = await Website.create(req.body);
    res.send(result);
  });
};
