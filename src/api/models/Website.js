module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String },
      domain: { type: String }, // clean domain of website (no protocol, port and trailing slash)
      isPublic: { type: Boolean }, // whether can be viewed in public page
    },
    { timestamps: true }
  );
  return mongoose.model('Website', schema);
};
