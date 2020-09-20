const { path } = require('@vuepress/shared-utils')

module.exports = (options, context) => ({
  define () {
    const { title, width, body, footer } = options || {}
    return {
      WIDTH: width || '260px',
      TITLE: title || '公告',
      BODY: body || [],
      FOOTER: footer || []
    }
  },
  name: '@vuepress-reco/vuepress-plugin-bulletin-popover',
  enhanceAppFiles: [
    path.resolve(__dirname, './bin/enhanceAppFile.js')
  ],
  globalUIComponents: 'Bulletin'
})
