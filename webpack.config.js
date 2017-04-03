var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
// var debug = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    ruler: './src/index.js',
    example: './example/entry.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract({
          loader: 'sass-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'ruler.css',
      allChunks: true
    })
  ],
  devServer: {
    port: 8080,
    historyApiFallback: {
      index: './example/index.html'
    }
  }
}