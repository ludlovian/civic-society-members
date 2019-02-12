'use strict'

import h from '../../lib/hyperscript'

import { MDCRipple } from '@material/ripple'
import Button from './Button'

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

const Card = {
  template ({ children, class: cl, outlined, ripple, ...rest }) {
    cl = classnames(cl, 'mdc-card', outlined && 'mdc-card--outlined')

    const attrs = {
      ...rest,
      _key: rest._key || rest.id || 'mdcButton',
      _hooks: getHooks(ripple)
    }

    return (
      <div class={cl} {...attrs}>
        {children}
      </div>
    )
  }
}

Card.Actions = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-card__actions')

    return (
      <div class={cl} {...rest}>
        {children}
      </div>
    )
  }
}

Card.ActionButton = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-card', 'mdc-card__action--button')

    return (
      <Button class={cl} {...rest}>
        {children}
      </Button>
    )
  }
}

Card.ActionIcons = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-card__action-icons')

    return (
      <div class={cl} {...rest}>
        {children}
      </div>
    )
  }
}

Card.ActionIcon = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(
      cl,
      'material-icons',
      'mdc-icon-button',
      'mdc-card__action',
      'mdc-card__action--icon'
    )

    return (
      <a class={cl} {...rest}>
        {children}
      </a>
    )
  }
}

export default Card
