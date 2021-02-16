module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    _date: { type: Number, default: Date.now },
    _account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },

    name: { type: String },
    url: { type: String },
    base: { type: String }, // base of website (start with '/' and no trailing slash)
    isPublic: { type: Boolean }, // whether can be viewed in public page
  });

  schema.index({ _date: -1 });
  schema.index({ _account: 1 });
  return mongoose.model('Website', schema);
};
