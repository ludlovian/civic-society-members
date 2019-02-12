'use strict'

import h from '../../lib/hyperscript'

import { MDCRipple } from '@material/ripple'

import classnames from 'classnames'
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

const Button = {
  template ({
    children,
    class: cl,
    ripple,
    href,
    dense,
    raised,
    unelevated,
    outlined,
    primary,
    secondary,
    ...rest
  }) {
    const El = href ? 'a' : 'button'
    cl = classnames(cl, 'mdc-button', {
      'mdc-button--dense': dense,
      'mdc-button--raised': raised,
      'mdc-button--unelevated': unelevated,
      'mdc-button--outlined': outlined,
      'mdc-theme--primary-bg': primary,
      'mdc-theme--secondary-bg': secondary
    })

    const attrs = {
      ...rest,
      _key: rest._key || rest.id || 'mdcButton',
      _hooks: getHooks(ripple)
    }

    return (
      <El class={cl} {...attrs}>
        <span class='mdc-button__label'>{children}</span>
      </El>
    )
  }
}

export default Button
