const { path } = require('@vuepress/shared-utils')

module.exports = (options, context) => {
  const { perPage = 10 } = options || {}
  return {
    define () {
      return {
        PERPAGE: perPage
      }
    },
    name: '@vuepress-reco/vuepress-plugin-pagation',
    enhanceAppFiles: [
      path.resolve(__dirname, './bin/enhanceAppFile.js'),
      () => ({
        name: 'dynamic-pagation',
        content: `export default ({ Vue }) => {
          Vue.mixin({
            computed: {
              $perPage () { return ${perPage} }
            }
          })
        }`
      })
    ]
  }
}
