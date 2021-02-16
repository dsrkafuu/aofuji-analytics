const bcrypt = require('bcrypt');

module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    _date: { type: Number, default: Date.now },

    username: { type: String },
    password: {
      type: String,
      select: false,
      set(val) {
        return bcrypt.hashSync(val, 10);
      },
    },
    isAdmin: { type: Boolean },
  });

  schema.index({ _date: -1 });
  schema.index({ username: 1 }, { unique: true });
  return mongoose.model('Account', schema);
};
