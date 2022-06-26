// vue.config.js

module.exports = {
  pages: {
    index: {
      entry: 'src/views/index.vue',
      title: '貪吃蛇',
    },
  },
  devServer: {
    port: 8088,
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/snackGame/'
    : '/',
};
