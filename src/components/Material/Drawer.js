'use strict'

import h from '../../lib/hyperscript'

import { MDCDrawer } from '@material/drawer'
import Icon from './Icon'

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

const Drawer = {
  template ({ children, class: cl, open, onOpen, onClose, ...rest }) {
    const attrs = {
      _key: rest._key || rest.id || 'mdcDrawer',
      _hooks: getHooks(onOpen, onClose, open)
    }

    cl = classnames(cl, 'mdc-drawer-container')

    return (
      <div class={cl} {...rest}>
        <aside class='mdc-drawer mdc-drawer--modal' {...attrs}>
          {children}
        </aside>
        <div class='mdc-drawer-scrim' />
      </div>
    )
  }
}

Drawer.Header = {
  template ({ children, class: cl, title, subtitle, ...rest }) {
    cl = classnames(cl, 'mdc-drawer__header')

    return (
      <div class={cl} {...rest}>
        {title && <h3 class='mdc-drawer__title'>{title}</h3>}
        {subtitle && <h6 class='mdc-drawer__subtitle'>{subtitle}</h6>}
        {children}
      </div>
    )
  }
}

Drawer.Content = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-drawer__content')

    return (
      <div class={cl} {...rest}>
        <nav class='mdc-list'>{children}</nav>
      </div>
    )
  }
}

Drawer.Item = {
  template ({ children, class: cl, selected, ...rest }) {
    cl = classnames(cl, 'mdc-list-item', selected && 'mdc-list-item--activated')

    return (
      <a class={cl} {...rest} aria-selected={selected}>
        {children}
      </a>
    )
  }
}

Drawer.ItemIcon = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-list-item__graphic')

    return (
      <Icon class={cl} {...rest} aria-hidden='true'>
        {children}
      </Icon>
    )
  }
}

Drawer.ItemText = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-list-item--text')

    return (
      <span class={cl} {...rest}>
        {children}
      </span>
    )
  }
}

export default Drawer
