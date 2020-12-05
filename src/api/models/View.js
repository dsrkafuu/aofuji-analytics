module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      _session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },
      pathname: { type: String },
      referrer: { type: String },
      pvt: { type: Number }, // page view time
      res: { type: Number }, // server response time
      dcl: { type: Number }, // `DOMContentLoaded` time
      load: { type: Number }, // `onload` time
    },
    { timestamps: true }
  );
  return mongoose.model('View', schema);
};
