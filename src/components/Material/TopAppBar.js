'use strict'

import h from '../../lib/hyperscript'

import { MDCTopAppBar } from '@material/top-app-bar/index'

import classnames from 'classnames'
import memoize from '../../lib/memoize'

const getHooks = memoize(onNav => ({
  didInsert (node) {
    node.data = node.data || {}
    node.data.mdcTopAppBar = new MDCTopAppBar(node.el)
    if (onNav) node.data.mdcTopAppBar.listen('MDCTopAppBar:nav', onNav)
  },

  willRecycle (prev, node) {
    node.data = prev.data
  },

  willRemove (node) {
    if (onNav) node.data.mdcTopAppBar.unlisten('MDCTopAppBar:nav', onNav)
    node.data.mdcTopAppBar.destroy()
  }
}))

const TopAppBar = {
  template ({ children, class: cl, fixed, onNav, ...rest }) {
    cl = classnames(cl, 'mdc-top-app-bar', fixed && 'mdc-top-app-bar--fixed')
    const attrs = {
      ...rest,
      _key: rest._key || rest.id || 'mdcTopAppBar',
      _hooks: getHooks(onNav)
    }
    return (
      <header class={cl} {...attrs}>
        {children}
      </header>
    )
  }
}

TopAppBar.Row = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-top-app-bar__row')

    return (
      <div class={cl} {...rest}>
        {children}
      </div>
    )
  }
}

TopAppBar.Section = {
  template ({ children, class: cl, alignStart, alignEnd, ...rest }) {
    cl = classnames(
      cl,
      'mdc-top-app-bar__section',
      alignStart && 'mdc-top-app-bar__section--align-start',
      alignEnd && 'mdc-top-app-bar__section--align-end'
    )

    return (
      <section class={cl} {...rest}>
        {children}
      </section>
    )
  }
}

TopAppBar.Icon = {
  template ({ children, class: cl, navigation, ...rest }) {
    cl = classnames(
      cl,
      'material-icons',
      navigation && 'mdc-top-app-bar__navigation-icon'
    )

    return (
      <a class={cl} {...rest}>
        {children}
      </a>
    )
  }
}

export default TopAppBar
