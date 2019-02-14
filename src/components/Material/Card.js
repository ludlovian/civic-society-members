'use strict'

import { h, el, hargs, classify } from '../../domvm'

import { MDCRipple } from '@material/ripple'
import { Button } from '.'

import memoize from '../../lib/memoize'

const getHooks = memoize(ripple => ({
  didInsert (node) {
    node.data = node.data || {}
    if (ripple) {
      node.data.mdcRipple = new MDCRipple(node.el)
    }
  },

  willRecycle (prev, node) {
    node.data = prev.data
  },

  willRemove (node) {
    if (ripple) {
      node.data.mdcRipple.destroy()
    }
  }
}))

export default function Card (...args) {
  const [{ outlined, ripple, ...rest }, children] = hargs(args)
  return classify(
    outlined && 'mdc-card--outlined',
    el(
      '.mdc-card',
      {
        ...rest,
        _key: rest._key || rest.id || 'mdcButton',
        _hooks: getHooks(ripple)
      },
      children
    )
  )
}

Card.Actions = (...args) => classify('mdc-card__actions', h('div', ...args))

Card.ActionButton = (...args) =>
  classify('mdc-card', 'mdc-card__action--button', Button(...args))

Card.ActionIcons = (...args) =>
  classify('mdc-card__action-icons', h('div', ...args))

Card.ActionIcon = (...args) =>
  classify(
    'material-icons',
    'mdc-icon-button',
    'mdc-card__action',
    'mdc-card__action--icon',
    h('a', ...args)
  )
