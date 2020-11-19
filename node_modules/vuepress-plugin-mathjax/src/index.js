const { resolve } = require('path')
const tex2html = require('./tex2html')
const mathJaxPlugin = require('./markdown')
const defaultMacros = require('./defaultMacros')
const mergeable = require('vuepress-mergeable')

module.exports = mergeable((config, context) => {
  const { style, render } = tex2html(config, context.tempPath)

  if (config.showError === undefined) {
    config.showError = process.env.NODE_ENV === 'development'
  }

  return {
    name: 'vuepress-plugin-mathjax',

    async ready () {
      await context.writeTemp('plugins-mathjax.css', style)
    },

    extendMarkdown (md) {
      md.use(mathJaxPlugin, {
        render,
        config,
      })
    },

    enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),
  }
}, {
  macros: 'assign',
  presets: 'flat',
}, {
  macros: defaultMacros,
})
