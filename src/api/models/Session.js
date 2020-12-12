module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    uuid: { type: String },
    language: { type: String },
    screen: { type: String }, // screen pixel size
    browser: { type: String },
    system: { type: String },
    location: { type: String },
    _date: { type: Number, default: Date.now },
  });

  schema.index({ uuid: 1 }, { unique: true });
  schema.index({ _date: -1 });

  return mongoose.model('Session', schema);
};
