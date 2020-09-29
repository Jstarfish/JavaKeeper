module.exports = {
  extends: 'airbnb',
  env: {
    node: true,
    mocha: true,
    browser: true,
  },
  rules: {
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'no-else-return': 0,
    'max-len': 0,
    'no-console': [ 2, { allow: ['warn', 'trace'] } ],
    'no-restricted-syntax': [ 0, 'ForInStatement' ],
    'no-new': 0,
    'new-cap': 0,
    'default-case': 0,
  }
};
