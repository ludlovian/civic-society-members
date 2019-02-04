'use strict'

import m from 'mithril'

import { MDCTopAppBar } from '@material/top-app-bar/index'

import { classnames } from '../../lib/classify'

export default function TopAppBar () {
  let control
  let _onNav

  function onNav (e) {
    if (_onNav) _onNav(e)
  }

  return {
    oncreate ({ dom }) {
      control = new MDCTopAppBar(dom)
      control.listen('MDCTopAppBar:nav', onNav)
    },

    onremove () {
      control.unlisten('MDCTopAppBar:nav', onNav)
      control.destroy()
    },

    view ({ children, attrs }) {
      const { className, fixed, onNav, xattrs = {}, ...rest } = attrs
      _onNav = onNav
      const cl = classnames(
        className,
        'mdc-top-app-bar',
        fixed && 'mdc-top-app-bar--fixed'
      )

      return (
        <header className={cl} {...xattrs} {...rest}>
          {children}
        </header>
      )
    }
  }
}

TopAppBar.Row = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-top-app-bar__row')

    return (
      <div className={cl} {...xattrs} {...rest}>
        {children}
      </div>
    )
  }
}

TopAppBar.Section = {
  view ({ children, attrs }) {
    const { className, alignStart, alignEnd, xattrs = {}, ...rest } = attrs
    const cl = classnames(
      className,
      'mdc-top-app-bar__section',
      alignStart && 'mdc-top-app-bar__section--align-start',
      alignEnd && 'mdc-top-app-bar__section--align-end'
    )

    return (
      <section className={cl} {...xattrs} {...rest}>
        {children}
      </section>
    )
  }
}

TopAppBar.Icon = {
  view ({ children, attrs }) {
    const { className, navigation, xattrs = {}, ...rest } = attrs
    const cl = classnames(
      className,
      'material-icons',
      navigation && 'mdc-top-app-bar__navigation-icon'
    )

    return (
      <a className={cl} {...xattrs} {...rest}>
        {children}
      </a>
    )
  }
}
