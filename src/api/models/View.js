const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _date: { type: Number, default: Date.now },
  _session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },

  pathname: { type: String },
  referrer: { type: String },
  pvt: { type: Number, default: 0 }, // page view time
});

schema.index({ _date: -1 });
schema.index({ _session: 1 });
schema.index({ _website: 1 });

module.exports = mongoose.model('View', schema);
