'use strict'

import m from 'mithril'

import { MDCDrawer } from '@material/drawer'
import Icon from './Icon'

import classify from '../../lib/classify'

export default
function Drawer () {
  let control
  return {
    oncreate ({ dom, attrs: { onOpen, onClose } }) {
      control = new MDCDrawer(dom.firstElementChild)
      if (onOpen) control.listen('MDCDrawer:opened', onOpen)
      if (onClose) control.listen('MDCDrawer:closed', onClose)
    },

    onupdate ({ attrs: { open } }) {
      if (control.open !== open) control.open = open
    },

    onremove ({ attrs: { onOpen, onClose } }) {
      if (onOpen) control.unlisten('MDCDrawer:opened', onOpen)
      if (onClose) control.unlisten('MDCDrawer:closed', onClose)
      control.destroy()
    },

    view ({ children, attrs }) {
      const {
        className,
        xattrs = {},
        ...rest } = attrs
      return classify(
        className,
        'mdc-drawer-container',
        m('div', { ...xattrs, ...rest },
          classify(
            'mdc-drawer',
            'mdc-drawer--modal',
            m('aside', children)
          ),
          classify(
            'mdc-drawer-scrim',
            m('div')
          )
        )
      )
    }
  }
}

Drawer.Header = {
  view ({ children, attrs }) {
    const {
      className,
      title,
      subtitle,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-drawer__header',
      m('div', { ...xattrs, ...rest },
        title && m('h3.mdc-drawer__title', title),
        subtitle && m('h6.mdc-drawer__subtitle', subtitle),
        children
      )
    )
  }
}

Drawer.Content = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-drawer__content',
      m('div', { ...xattrs, ...rest },
        m('nav.mdc-list', children)
      )
    )
  }
}

Drawer.Item = {
  view ({ children, attrs }) {
    const {
      className,
      selected,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-list-item',
      { 'mdc-list-item--activated': selected },
      m('a', { ...xattrs, ...rest, 'aria-selected': selected },
        children
      )
    )
  }
}

Drawer.ItemIcon = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs,
      ...rest } = attrs
    return classify(
      className,
      'mdc-list-item__graphic',
      m(Icon, { xattrs, ...rest, 'aria-hidden': true }, children)
    )
  }
}

Drawer.ItemText = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-list-item--text',
      m('span', { ...xattrs, ...rest }, children)
    )
  }
}
