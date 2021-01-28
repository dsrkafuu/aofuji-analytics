/* utils */
const buildError = require('../utils/buildError.js');
const { Website, Account, select } = require('../utils/mongoose.js');

const selectKeys = 'name domain isPublic';

module.exports = (router) => {
  // get all websites
  router.get('/website', async (req, res) => {
    const result = await Website.find({}).select(selectKeys).limit(50).lean();
    res.send(result);
  });

  // get one website
  router.get('/website/:id', async (req, res) => {
    const result = await Website.findById(req.params.id).select(selectKeys).lean();
    res.send(result);
  });

  // create a new website
  router.post('/website', async (req, res) => {
    const { name, domain, isPublic } = req.body;
    const account = await Account.findOne({}).lean();
    if (account) {
      const result = await Website.create({
        _account: account._id,
        name,
        domain,
        isPublic,
        _date: Date.now(),
      });
      res.status(201).send(select(result, selectKeys));
    } else {
      throw buildError(403, 'website account not found');
    }
  });

  // modify a website
  router.put('/website/:id', async (req, res) => {
    const { name, domain, isPublic } = req.body;
    const result = await Website.findByIdAndUpdate(req.params.id, {
      name,
      domain,
      isPublic,
      _date: Date.now(),
    })
      .select(selectKeys)
      .lean();
    res.status(201).send(result);
  });

  // delete a website
  router.delete('/website/:id', async (req, res) => {
    await Website.findByIdAndDelete(req.params.id).lean();
    res.status(201).send();
  });
};
