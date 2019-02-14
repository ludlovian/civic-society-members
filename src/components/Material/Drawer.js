'use strict'

import { h, hargs, classify, el } from '../../domvm'

import { MDCDrawer } from '@material/drawer'
import { Icon } from '.'

import classnames from 'classnames'
import memoize from '../../lib/memoize'

const getHooks = memoize((onOpen, onClose, open) => ({
  didInsert (node) {
    const data = (node.data = node.data || {})
    const mdcDrawer = (data.mdcDrawer = new MDCDrawer(node.el))
    if (onOpen) mdcDrawer.listen('MDCDrawer:opened', onOpen)
    if (onClose) mdcDrawer.listen('MDCDrawer:closed', onClose)
    if (open) {
      data.monitor = open.map(v => {
        mdcDrawer.open = v
      })
    }
  },

  willRecycle (prev, node) {
    node.data = prev.data
  },

  willRemove (node) {
    const { data } = node
    const { mdcDrawer, monitor } = data
    if (onOpen) mdcDrawer.unlisten('MDCDrawer:opened', onOpen)
    if (onClose) mdcDrawer.unlisten('MDCDrawer:closed', onClose)
    if (open) monitor.end(true)
    mdcDrawer.destroy()
  }
}))

export default function Drawer (...args) {
  const [{ open, onOpen, onClose, ...rest }, children] = hargs(args)
  return el('.mdc-drawer-container', rest, [
    el(
      'aside.mdc-drawer.mdc-drawer--modal',
      {
        _key: rest._key || rest.id || 'mdcDrawer',
        _hooks: getHooks(onOpen, onClose, open)
      },
      children
    ),
    el('div.mdc-drawer-scrim')
  ])
}

Drawer.Header = (...args) => {
  const [{ title, subtitle, ...rest }, children] = hargs(args)
  return el('.mdc-drawer__header', rest, [
    title && el('h3.mdc-drawer__title', title),
    subtitle && el('h6.mdc-drawer__subtitle', subtitle),
    children
  ])
}

Drawer.Content = (...args) => {
  const [attrs, children] = hargs(args)
  return el('.mdc-drawer__content', attrs, [el('nav.mdc-list', children)])
}

Drawer.Item = (...args) => {
  const [{ selected, ...rest }, children] = hargs(args)
  return el(
    'a.mdc-list-item',
    {
      ...rest,
      class: classnames(rest.class, selected && 'mdc-list-item--activated')
    },
    children
  )
}

Drawer.ItemIcon = (...args) => classify('mdc-list-item__graphic', Icon(...args))

Drawer.ItemText = (...args) => h('span.mdc-list-item--text', ...args)
