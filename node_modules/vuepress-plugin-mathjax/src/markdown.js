// based on
// https://github.com/waylonflinn/markdown-it-katex
// https://github.com/classeur/markdown-it-mathjax

const { escapeHtml } = require('@vuepress/shared-utils')

function isWhitespace (char) {
  return char === ' ' || char === '\t' || char === '\n'
}

function math (state, silent) {
  let startPosition = state.pos
  if (state.src[startPosition] !== '$') {
    return false
  }

  let markup = '$'
  const afterStart = state.src[++startPosition]
  if (afterStart === '$') {
    markup = '$$'
    if (state.src[++startPosition] === '$') {
      // 3 markers are too much
      return false
    }
  } else {
    // Skip if opening $ is succeeded by a space character
    if (isWhitespace(afterStart)) {
      return false
    }
  }

  const endPosition = state.src.indexOf(markup, startPosition)
  if (endPosition === -1) {
    return false
  }

  // escape
  if (state.src[endPosition - 1] === '\\') {
    return false
  }

  const nextPosition = endPosition + markup.length

  // Skip if $ is preceded by a space character
  const beforeEnd = state.src[endPosition - 1]
  if (isWhitespace(beforeEnd)) {
    return false
  }

  // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)

  // Fix issue #1.
  // Previous implementation led to NaN comparison.
  const afterEnd = state.src.charCodeAt(nextPosition) || -1
  if (afterEnd >= 0x30 && afterEnd <= 0x39) {
    return false
  }

  if (!silent) {
    const token = state.push(markup.length === 1 ? 'math_inline' : 'math_display', '', 0)
    token.markup = markup
    token.content = state.src.slice(startPosition, endPosition)
  }

  state.pos = nextPosition
  return true
}

module.exports = (md, options) => {
  const { render, config } = options

  md.inline.ruler.after('escape', 'math', math)

  function getMathRenderer (display, wrapper) {
    return (tokens, index, options, env) => {
      const { content } = tokens[index]
      try {
        const { mathjax = {} } = env.frontmatter || {}
        return wrapper(render(content, display, mathjax.presets))
      } catch (error) {
        if (config.showError && env.loader) {
          env.loader.emitError(error)
        }
        return wrapper(escapeHtml(content))
      }
    }
  }

  md.renderer.rules.math_inline = getMathRenderer(false, content => content)
  md.renderer.rules.math_display = getMathRenderer(true, content => `<p>${content}</p>`)
}
