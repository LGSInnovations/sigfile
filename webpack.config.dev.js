const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    'sigfile': ['./js/index'],
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: 'sigfile',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      }
    ]
  }
};
