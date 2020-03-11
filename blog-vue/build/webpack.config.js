const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',  // 编译目标
  entry: path.resolve(__dirname, '../src/index.js'), // 入口文件
  output: { // 出口文件
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl(us)?/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024,    // 每次输出文件的字节数的大小
            name: '[name].[ext]'    // 输出的文件类型
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'template.html')
    })
  ]
}

if (!isDev) {
  config.mode = 'production'
}

if (isDev) {
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
      port: 8010,
      host: '0.0.0.0',    // 可以通过loaclhost、127.0.0.1、本机内网ip、手机等访问
      overlay: {  // 将编译的错误显示到页面上
          errors: true
      },
      hot: true   // 热加载
  }
}

module.exports = config