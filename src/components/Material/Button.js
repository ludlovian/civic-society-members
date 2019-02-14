'use strict'

import { el, hargs, classify } from '../../domvm'
import { MDCRipple } from '@material/ripple'
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

export default function Button (...args) {
  const [
    {
      ripple,
      href,
      dense,
      raised,
      unelevated,
      outlined,
      primary,
      secondary,
      ...rest
    },
    children
  ] = hargs(args)
  return classify(
    'mdc-button',
    dense && 'mdc-button--dense',
    raised && 'mdc-button--raised',
    unelevated && 'mdc-button--unelevated',
    outlined && 'mdc-button--outlined',
    primary && 'mdc-theme--primary-bg',
    secondary && 'mdc-theme--secondary-bg',
    el(
      href ? 'a' : 'button',
      {
        ...rest,
        _key: rest._key || rest.id || 'mdcButton',
        _hooks: getHooks(ripple)
      },
      children
    )
  )
}
