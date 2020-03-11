const path = require('path')
const merge = require('webpack-merge')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

const devServer = {
  port: 8010,
  host: '0.0.0.0', // 可以通过loaclhost、127.0.0.1、本机内网ip、手机等访问
  overlay: { // 将编译的错误显示到页面上
    errors: true
  },
  hot: true // 热加载
}

const defaultPlugin = [
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

let config

if (isDev) {
  config = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.styl(us)?/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    devServer,
    plugins: defaultPlugin.concat([
      new MiniCssExtractPlugin({
        filename: '[name].[chunkHash:8].css',
        chunkFilename: '[name].[chunkHash:8].css'
      })
    ])
  })
} else {
  config = merge(baseConfig, {
    module: {
      rules: [
        {
          test: /\.styl(us)?/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    plugins: defaultPlugin.concat([
      new MiniCssExtractPlugin({
        filename: '[name].[chunkHash:8].css',
        chunkFilename: '[name].[chunkHash:8].css'
      })
    ]),
    optimization: {
      splitChunks: {
        cacheGroups: { // 设置缓存组
          commons: {
            chunks: 'initial',
            minChunks: 2, // 在分割模块之前共享模块的最小块数(默认是1)
            maxInitialRequests: 5, // 入口点上的最大并行请求数(默认是3)
            minSize: 0
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true
          }
        }
      },
      runtimeChunk: true
    }
  })
}

module.exports = config
