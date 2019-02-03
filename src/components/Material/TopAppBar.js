'use strict'

import m from 'mithril'

import { MDCTopAppBar } from '@material/top-app-bar/index'

import classify from '../../lib/classify'

export default function TopAppBar () {
  let control

  return {
    oncreate ({ dom, attrs: { onNav } }) {
      control = new MDCTopAppBar(dom)
      if (onNav) control.listen('MDCTopAppBar:nav', onNav)
    },

    onremove ({ attrs: { onNav } }) {
      if (onNav) control.unlisten('MDCTopAppBar:nav', onNav)
      control.destroy()
    },

    view ({ children, attrs }) {
      const { className, fixed, xattrs = {}, ...rest } = attrs
      return classify(
        className,
        'mdc-top-app-bar',
        { 'mdc-top-app-bar--fixed': fixed },
        m('header', { ...xattrs, ...rest }, children)
      )
    }
  }
}

TopAppBar.Row = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    return classify(
      className,
      'mdc-top-app-bar__row',
      m('div', { ...xattrs, ...rest }, children)
    )
  }
}

TopAppBar.Section = {
  view ({ children, attrs }) {
    const { className, alignStart, alignEnd, xattrs = {}, ...rest } = attrs
    return classify(
      className,
      'mdc-top-app-bar__section',
      {
        'mdc-top-app-bar__section--align-start': alignStart,
        'mdc-top-app-bar__section--align-end': alignEnd
      },
      m('section', { ...xattrs, ...rest }, children)
    )
  }
}

TopAppBar.Icon = {
  view ({ children, attrs }) {
    const { className, navigation, xattrs = {}, ...rest } = attrs
    return classify(
      className,
      'material-icons',
      { 'mdc-top-app-bar__navigation-icon': navigation },
      m('a', { ...xattrs, ...rest }, children)
    )
  }
}
