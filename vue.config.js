module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  // config webpack
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // production environments configuration
      config.devtool = 'nosources-source-map'

      const CompressionWebpackPlugin = require('compression-webpack-plugin')
      config.plugins.push(new CompressionWebpackPlugin())
    } else if (process.env.NODE_ENV === 'analyzer') {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
          .BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },

  chainWebpack: config => {},
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
}
