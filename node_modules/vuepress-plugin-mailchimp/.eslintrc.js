module.exports = {
  root: true,

  env: {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },

  parserOptions: {
    parser: 'babel-eslint' // Support dynamic import
  },

  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    "prettier/vue",
  ],
}
