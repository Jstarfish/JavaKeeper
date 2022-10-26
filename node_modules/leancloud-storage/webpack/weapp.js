const webpack = require('webpack');
const { create, entry, name } = require('./common');

const config = create();

config.entry = {
  [`${name}-weapp`]: entry,
  [`${name}-weapp-min`]: entry,
};
config.resolve.aliasFields = ['weapp', 'browser'];
config.plugins.push(new webpack.BannerPlugin({
  banner: 'var window={};var XMLHttpRequest;var navigator;var localStorage;',
  raw: true,
}));

module.exports = config;
