module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    // website id tag
    tag: {
      type: String,
    },
    // clean domain of website
    domain: {
      type: String,
    },
  });
  return mongoose.model('Website', schema);
};
