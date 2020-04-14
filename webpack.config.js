module.exports = {
  entry: {
    sigfile: ['./src/index'],
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].src',
    library: 'sigfile',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
    ],
  },
};
