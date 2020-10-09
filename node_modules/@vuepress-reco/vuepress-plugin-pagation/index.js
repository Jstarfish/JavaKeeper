const { path } = require('@vuepress/shared-utils')

module.exports = (options, context) => ({
  define () {
    const { perPage } = options || {}
    return {
      PERPAGE: perPage
    }
  },
  name: '@vuepress-reco/vuepress-plugin-pagation',
  enhanceAppFiles: [
    path.resolve(__dirname, './bin/enhanceAppFile.js')
  ]
})
