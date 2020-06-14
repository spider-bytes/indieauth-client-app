module.exports = {
  devServer: {
    proxy: {
      '^/indie-auth-com/auth': {
        target: 'https://indieauth.com/auth',
        ignorePath: true,
        changeOrigin: true,
        logLevel: 'debug',

      },
      '^/indie-auth-com/token': {
        target: 'https://tokens.indieauth.com/token',
        ignorePath: true,
        changeOrigin: true,
        logLevel: 'debug',
      }
    }
  },
  configureWebpack: {
    resolve: {
      symlinks: false
    }
  }
}
