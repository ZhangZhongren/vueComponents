// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  publicPath: './',
  configureWebpack: config => ({
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, './static/'),
            to: './static'
          }
        ]
      }),
    ]
  }),
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('assets', resolve('./src/assets'))
      .set('com', resolve('./src/components'))
      .set('views', resolve('./src/views'))
      .set('@style', resolve('./src/style'))
      .set('@libs', resolve('./src/libs'))

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          preserveWhitespace: false
        }
      })
      .end()
      .use('./md-loader/index.js')
      .loader(path.resolve(__dirname, './md-loader/index.js'))
  },
  devServer: {
    hot: true,
    clientLogLevel: 'warning',
    proxy: {
      '/api': {
        target: 'http://localhost:9999/api',
        changeOrigin: true,
        pathRewrite: {}
      }
    }
  }
}
