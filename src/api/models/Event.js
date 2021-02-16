module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    _session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },

    name: { type: String },
    type: { type: String },
    _date: { type: Number, default: Date.now },
  });

  schema.index({ _date: -1 });
  schema.index({ _session: 1 });
  schema.index({ _website: 1 });
  return mongoose.model('Event', schema);
};
