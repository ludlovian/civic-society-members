'use strict'

import m from 'mithril'

import { MDCDrawer } from '@material/drawer'
import Icon from './Icon'

import { classnames } from '../../lib/classify'

export default function Drawer () {
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
      const { className, open, onOpen, onClose, xattrs = {}, ...rest } = attrs
      const cl = classnames(className, 'mdc-drawer-container')

      return (
        <div className={cl} {...xattrs} {...rest}>
          <aside className='mdc-drawer mdc-drawer--modal'>{children}</aside>
          <div className='mdc-drawer-scrim' />
        </div>
      )
    }
  }
}

Drawer.Header = {
  view ({ children, attrs }) {
    const { className, title, subtitle, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-drawer__header')

    return (
      <div className={cl} {...xattrs} {...rest}>
        {title && <h3 className='mdc-drawer__title'>{title}</h3>}
        {subtitle && <h6 className='mdc-drawer__subtitle'>{subtitle}</h6>}
        {children}
      </div>
    )
  }
}

Drawer.Content = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-drawer__content')

    return (
      <div className={cl} {...xattrs} {...rest}>
        <nav className='mdc-list'>{children}</nav>
      </div>
    )
  }
}

Drawer.Item = {
  view ({ children, attrs }) {
    const { className, selected, xattrs = {}, ...rest } = attrs
    const cl = classnames(
      className,
      'mdc-list-item',
      selected && 'mdc-list-item--activated'
    )

    return (
      <a className={cl} {...xattrs} {...rest} aria-selected={selected}>
        {children}
      </a>
    )
  }
}

Drawer.ItemIcon = {
  view ({ children, attrs }) {
    const { className, xattrs, ...rest } = attrs
    const cl = classnames(className, 'mdc-list-item__graphic')

    return (
      <Icon className={cl} xattrs={xattrs} {...rest} aria-hidden='true'>
        {children}
      </Icon>
    )
  }
}

Drawer.ItemText = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-list-item--text')

    return (
      <span className={cl} {...xattrs} {...rest}>
        {children}
      </span>
    )
  }
}
