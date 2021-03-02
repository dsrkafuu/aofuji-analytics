// ensure env not undefined in index html template
process.env.VUE_APP_TITLE = process.env.VUE_APP_TITLE || 'Aofuji Analytics';

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL || '/',
  productionSourceMap: false,
  devServer: {
    port: process.env.SERVER_PORT || 3000,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.SERVER_API_PORT || 3001}`,
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: "@import '@/scss/variables.scss';",
      },
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
};
