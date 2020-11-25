module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? process.env.BASE_URL || '/' : '/',
  productionSourceMap: false,
  devServer: {
    port: process.env.SERVER_PORT || 3000,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.API_SERVER_PORT || 3001}`,
        changeOrigin: true,
      },
    },
  },
};
