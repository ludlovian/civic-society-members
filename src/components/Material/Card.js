'use strict'

import m from 'mithril'

import { MDCRipple } from '@material/ripple'
import Button from './Button'

import classify from '../../lib/classify'

export default
function Card () {
  let mdcRipple

  return {
    oncreate ({ dom, attrs }) {
      if (attrs.ripple) mdcRipple = new MDCRipple(dom)
    },

    onremove () {
      if (mdcRipple) mdcRipple.destroy()
    },

    view ({ children, attrs }) {
      const {
        className,
        outlined,
        ripple,
        xattrs = {},
        ...rest } = attrs
      return classify(
        className,
        'mdc-card',
        { 'mdc-card--outlined': outlined },
        m('div', { ...xattrs, ...rest }, children)
      )
    }
  }
}

Card.Actions = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-card__actions',
      m('div', { ...xattrs, ...rest }, children)
    )
  }
}

Card.ActionButton = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-card',
      'mdc-card__action--button',
      m(Button, { xattrs, ...rest }, children)
    )
  }
}

Card.ActionIcons = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-card__action-icons',
      m('div', { ...xattrs, ...rest }, children)
    )
  }
}

Card.ActionIcon = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'material-icons',
      'mdc-icon-button',
      'mdc-card__action',
      'mdc-card__action--icon',
      m('a', { ...xattrs, ...rest }, children)
    )
  }
}
