/* utils */
const { Website, User } = require('../utils/mongoose.js');
const buildError = require('../utils/buildError.js');

module.exports = (router) => {
  // get all websites
  router.get('/website', async (req, res) => {
    const int = setInterval(() => {
      console.log(Date.now());
    }, 1000);
    const result = await Website.find({}).lean();
    clearInterval(int);
    console.log(result);
    res.send(result);
  });

  // get one website
  router.get('/website/:id', async (req, res) => {
    const result = await Website.findById(req.params.id).lean();
    res.send(result);
  });

  // create a new websites
  router.post('/website', async (req, res) => {
    const { username, name, domain, isPublic } = req.body;
    const user = await User.findOne({ username }).lean();
    console.log(user);
    if (user) {
      const result = await Website.create({
        _user: user._id,
        name,
        domain,
        isPublic,
        _date: Date.now(),
      });
      res.status(201).send(result);
    } else {
      throw buildError(403, 'website user not found');
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
    }).lean();
    res.status(201).send(result);
  });

  // delete a website
  router.delete('/website/:id', async (req, res) => {
    const result = await Website.findByIdAndDelete(req.params.id).lean();
    res.send(result);
  });
};
