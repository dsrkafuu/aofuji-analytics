const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _date: { type: Number, default: Date.now },
  _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },

  ip: { type: String },
  language: { type: String },
  browser: { type: String },
  system: { type: String },
  platform: { type: String },
  location: { type: String },
});

schema.index({ _date: -1 });
schema.index({ _website: 1 });
schema.index({ ip: 1 });

module.exports = mongoose.model('Session', schema);
