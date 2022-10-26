const { create, entry, name } = require('./common');

const config = create();

config.entry = {
  [`${name}`]: entry,
  [`${name}-min`]: entry,
};

module.exports = config;
