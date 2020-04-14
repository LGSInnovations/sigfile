const path = require('path');

module.exports = [
  {
    entry: {
      sigfile: ['./src/index'],
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name].js',
      library: 'sigfile',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /.js$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
        },
      ],
    },
  },
  {
    entry: {
      bluefile: ['./src/bluefile'],
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name].js',
      library: 'bluefile',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /.js$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
        },
      ],
    },
  },
  {
    entry: {
      matfile: ['./src/matfile'],
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name].js',
      library: 'matfile',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /.js$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
        },
      ],
    },
  },
];
