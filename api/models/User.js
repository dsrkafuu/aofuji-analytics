module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      // username
      username: String,
      // password
      password: String,
      // whether is admin
      isAdmin: Boolean,
    },
    { timestamps: true }
  );
  return mongoose.model('User', schema);
};
