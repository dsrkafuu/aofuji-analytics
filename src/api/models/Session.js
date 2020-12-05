module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      uuid: { type: String, index: true, unique: true },
      _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },
      lang: { type: String },
      screen: { type: String }, // screen pixel size
      browser: { type: String },
      system: { type: String },
      location: { type: String },
    },
    { timestamps: true }
  );
  return mongoose.model('Session', schema);
};
