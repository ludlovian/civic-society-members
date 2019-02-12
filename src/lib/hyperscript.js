'use strict'

import { defineElement, defineView } from 'domvm/dist/dev/domvm.dev'

export default function h (...args) {
  // process args
  const tag = args[0]
  const attr = args[1]
  let children = []
    .concat(...args.slice(2))
    .filter(x => x != null && x !== false)

  // is it a regular DOM element
  if (typeof tag === 'string') {
    return defineElement(tag, attr, children)
  }

  // is it a template - this is determined by
  //  - { template: }
  const data = { ...(attr || {}) }
  if (args.length > 2) data.children = children

  if (typeof tag === 'object' && typeof tag.template === 'function') {
    return tag.template(data)
  }

  // must just be a view, then
  return defineView(tag, data, data.key)
}
