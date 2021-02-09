module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    language: { type: String },
    screen: { type: String }, // screen pixel size
    browser: { type: String },
    system: { type: String },
    platform: { type: String },
    location: { type: String },
    new: { type: Boolean, default: true },
    _date: { type: Number, default: Date.now },
  });

  schema.index({ new: 1 });
  schema.index({ _date: -1 });
  return mongoose.model('Session', schema);
};
