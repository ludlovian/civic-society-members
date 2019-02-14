'use strict'

import {
  defineElementSpread as el,
  defineView as vw,
  createView
} from 'domvm/dist/micro/domvm.micro'

import classnames from 'classnames'

const VNode = el('div').constructor

const isPojo = o =>
  o && typeof o === 'object' && !Array.isArray(o) && !(o instanceof VNode)

function hargs (args) {
  let attrs = isPojo(args[0]) ? args.shift() : {}
  let children = args.length === 0 ? undefined : [].concat(...args)
  return [attrs, children]
}

function h (tag, ...args) {
  let attrs = isPojo(args[0]) ? args.shift() : {}
  let children = args.length === 0 ? undefined : [].concat(...args)
  if (typeof tag === 'string') {
    return el(tag, attrs, children)
  } else {
    return vw(tag, { ...attrs, children }, attrs.key)
  }
}

function classify (...args) {
  const vnode = args.pop()
  if (!vnode.attrs) vnode.attrs = {}
  vnode.attrs.class = classnames(vnode.attrs.class, ...args)
  return vnode
}

export { h, hargs, classify, el, vw, createView }
