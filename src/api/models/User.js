module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      username: { type: String },
      password: { type: String },
      isAdmin: { type: Boolean },
    },
    { timestamps: true }
  );
  return mongoose.model('User', schema);
};
