const { create, entry, name } = require('./common');

const config = create();

config.entry = {
  [`${name}-rn-min`]: entry,
};
config.resolve.aliasFields = ['react-native', 'browser'];
config.externals = {
  'react-native': 'react-native',
};

module.exports = config;
