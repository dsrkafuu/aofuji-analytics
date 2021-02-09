const bcrypt = require('bcrypt');

module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    username: { type: String },
    password: {
      type: String,
      select: false,
      set(val) {
        return bcrypt.hashSync(val, 10);
      },
    },
    isAdmin: { type: Boolean },
    _date: { type: Number, default: Date.now },
  });

  schema.index({ username: 1 }, { unique: true });
  schema.index({ _date: -1 });
  return mongoose.model('Account', schema);
};
