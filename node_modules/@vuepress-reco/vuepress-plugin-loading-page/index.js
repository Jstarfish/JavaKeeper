const { path } = require('@vuepress/shared-utils')

module.exports = (options, context) => ({
  name: '@vuepress-reco/vuepress-plugin-loading-page',
  enhanceAppFiles: [
    path.resolve(__dirname, './bin/enhanceAppFile.js')
  ]
})