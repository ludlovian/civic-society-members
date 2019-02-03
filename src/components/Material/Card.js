'use strict'

import m from 'mithril'

import { MDCRipple } from '@material/ripple'
import Button from './Button'

import { classnames } from '../../lib/classify'

export default function Card () {
  let mdcRipple

  return {
    oncreate ({ dom, attrs }) {
      if (attrs.ripple) mdcRipple = new MDCRipple(dom)
    },

    onremove () {
      if (mdcRipple) mdcRipple.destroy()
    },

    view ({ children, attrs }) {
      const { className, outlined, ripple, xattrs = {}, ...rest } = attrs
      const cl = classnames(className, 'mdc-card', {
        'mdc-card--outlined': outlined
      })

      return (
        <div className={cl} {...xattrs} {...rest}>
          {children}
        </div>
      )
    }
  }
}

Card.Actions = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-card__actions')

    return (
      <div className={cl} {...xattrs} {...rest}>
        {children}
      </div>
    )
  }
}

Card.ActionButton = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-card', 'mdc-card__action--button')

    return (
      <Button className={cl} {...xattrs} {...rest}>
        {children}
      </Button>
    )
  }
}

Card.ActionIcons = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-card__action-icons')

    return (
      <div className={cl} {...xattrs} {...rest}>
        {children}
      </div>
    )
  }
}

Card.ActionIcon = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(
      className,
      'material-icons',
      'mdc-icon-button',
      'mdc-card__action',
      'mdc-card__action--icon'
    )

    return (
      <a className={cl} {...xattrs} {...rest}>
        {children}
      </a>
    )
  }
}
