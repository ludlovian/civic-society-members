'use strict'

import m from 'mithril'

import { MDCRipple } from '@material/ripple'

import classify from '../../lib/classify'

export default
function Button () {
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
        ...rest } = attrs

      return classify(
        className,
        'mdc-button',
        {
          'mdc-button--dense': dense,
          'mdc-button--raised': raised,
          'mdc-button--unelevated': unelevated,
          'mdc-button--outlined': outlined,
          'mdc-theme--primary-bg': primary,
          'mdc-theme--secondary-bg': secondary
        },
        m(href ? 'a' : 'button',
          { href, ...xattrs, ...rest },
          m('span.mdc-button__label',
            children
          )
        )
      )
    }
  }
}
