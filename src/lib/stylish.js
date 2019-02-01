'use strict'

const context = {
  nextId: 100,
  stylesheet: undefined,
  rules: [],
  cache: {},
  hasWindow: (() => {
    try {
      return !!window
    } catch (e) {
      return false
    }
  })(),
  isTest: process.env.NODE_ENV !== 'production'
}

if (context.hasWindow && context.isTest) window.$tylish = context
context.stylesheet = createStylesheet()

function createStylesheet () {
  if (!context.hasWindow) return
  const el = window.document.createElement('style')
  return window.document.head.appendChild(el).sheet
}

function insertRule (rule) {
  context.rules.push(rule)
  if (context.stylesheet) {
    context.stylesheet.insertRule(rule, context.stylesheet.cssRules.length)
  }
}

function getUsi () {
  return `stylish-${context.nextId++}`
}

function buildStyle (style) {
  const usi = getUsi()
  buildRules(style, usi).forEach(insertRule)
  return usi
}

function buildRules (style, usi) {
  style = style
    .replace(/\s*([,>+~;:}{]{1})\s*/mg, '$1')
    .trim()
    .replace(/;}/g, '}')
  const reSplit = /(.+?})/g
  const rules = []
  while (true) {
    const match = reSplit.exec(style)
    if (!match) break
    let rule = match[1]
    if (!/^(:root|@)/.test(rule)) {
      if (!/:self/.test(rule)) rule = ':self ' + rule
    }
    rule = rule.replace(/:self/g, '.' + usi)
    rules.push(rule)
  }
  return rules
}

export default
function stylish (style) {
  let c = context.cache[style]
  if (!c) c = context.cache[style] = buildStyle(style)
  return c
}
