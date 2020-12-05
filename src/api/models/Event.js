module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      _session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },
      name: { type: String },
      type: { type: String },
    },
    { timestamps: true }
  );
  return mongoose.model('Event', schema);
};
