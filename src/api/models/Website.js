module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    _account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    name: { type: String },
    domain: { type: String }, // clean domain of website (no protocol, port and trailing slash)
    isPublic: { type: Boolean }, // whether can be viewed in public page
    _date: { type: Number, default: Date.now },
  });

  schema.index({ _date: -1 });
  schema.index({ _user: 1 });
  return mongoose.model('Website', schema);
};
