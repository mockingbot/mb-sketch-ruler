module.exports = {
  entry: {
    ruler: './src/index.js',
    example: './example/entry.js'
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js'
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
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.sass$/,
        loader: 'style!css!sass'
      }
    ]
  },
  devServer: {
    port: 8080,
    historyApiFallback: {
      index: './example/index.html'
    }
  }
}