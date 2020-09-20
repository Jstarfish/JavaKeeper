const { path } = require('@vuepress/shared-utils')

module.exports = (options, context) => ({
  name: '@vuepress-reco/vuepress-plugin-mode',
  enhanceAppFiles: [
    path.resolve(__dirname, './bin/enhanceAppFile.js')
  ]
})
