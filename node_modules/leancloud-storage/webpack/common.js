const path = require('path');
const webpack = require('webpack');

const entry = exports.entry = process.env.LIVE_QUERY ? './src/index-live-query.js' : './src/index.js';
exports.name = process.env.LIVE_QUERY ? 'av-live-query' : 'av';

exports.create = () => ({
  entry: {
    av: entry,
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd2',
    library: 'AV',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {},
  devtool: 'source-map',
  node: {
    // do not polyfill Buffer
    Buffer: false,
    stream: false,
    process: false,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../node_modules/weapp-polyfill'),
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      }, {
        test: /\.js$/,
        enforce: 'pre',
        include: [
          path.resolve(__dirname, '../src'),
        ],
        use: [
          {
            loader: 'webpack-strip-block',
            options: {
              start: 'NODE-ONLY:start',
              end: 'NODE-ONLY:end',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'CLIENT_PLATFORM',
    ]),
    new webpack.optimize.UglifyJsPlugin({
      include: /-min\.js$/,
      sourceMap: true,
    }),
  ],
});
