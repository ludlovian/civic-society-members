'use strict'

import m from 'mithril'

import { MDCRipple } from '@material/ripple'

import { classnames } from '../../lib/classify'

export default function Button () {
  let control
  return {
    oncreate ({ dom, attrs: { ripple } }) {
      if (ripple) control = new MDCRipple(dom)
    },

    onremove () {
      if (control) control.destroy()
    },

    view ({ children, attrs }) {
      const {
        className,
        ripple,
        href,
        dense,
        raised,
        unelevated,
        outlined,
        primary,
        secondary,
        xattrs = {},
        ...rest
      } = attrs

      const El = href ? 'a' : 'button'
      const cl = classnames(className, 'mdc-button', {
        'mdc-button--dense': dense,
        'mdc-button--raised': raised,
        'mdc-button--unelevated': unelevated,
        'mdc-button--outlined': outlined,
        'mdc-theme--primary-bg': primary,
        'mdc-theme--secondary-bg': secondary
      })
      return (
        <El className={cl} {...xattrs} {...rest}>
          <span className='mdc-button__label'>{children}</span>
        </El>
      )
    }
  }
}
