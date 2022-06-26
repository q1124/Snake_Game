// vue.config.js

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
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
