module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    _session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },
    pathname: { type: String },
    referrer: { type: String },
    pvt: { type: Number, default: 0 }, // page view time
    _date: { type: Number, default: Date.now },
  });

  schema.index({ _website: 1 });
  schema.index({ _date: -1 });
  return mongoose.model('View', schema);
};
