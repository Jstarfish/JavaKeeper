import '@temp/plugins-mathjax.css'
import './index.css'

export default ({ Vue }) => {
  const { ignoredElements } = Vue.config
  if (ignoredElements.every(tag => tag.toString() !== '/^mjx-/')) {
    ignoredElements.push(/^mjx-/)
  }
}
