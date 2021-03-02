const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _date: { type: Number, default: Date.now },
  _account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },

  expire: { type: Number },
});

schema.index({ _date: -1 });
schema.index({ _account: 1 });
schema.index({ _website: 1 });

module.exports = mongoose.model('Share', schema);
