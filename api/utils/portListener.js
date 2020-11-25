/**
 * port listener, listen to api's own port or static server universal port
 * @param {Object} app express app
 */
module.exports = (app) => {
  const port =
    process.env.NODE_ENV === 'production'
      ? process.env.SERVER_PORT || 3000
      : process.env.API_SERVER_PORT || 3001;
  app.listen(port, () => {
    console.log(
      `[Goose ${process.env.NODE_ENV === 'production' ? 'Analytics' : 'Dev API'}]`,
      `Listening at http://localhost:${port}`
    );
  });
};
