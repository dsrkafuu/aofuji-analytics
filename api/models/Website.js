module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      // website name
      name: String,
      // clean domain of website
      domain: String,
      // website id tag
      tag: String,
    },
    { timestamps: true }
  );
  return mongoose.model('Website', schema);
};
