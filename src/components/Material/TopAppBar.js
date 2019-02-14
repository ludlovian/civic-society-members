'use strict'

import { classify, h, hargs, el } from '../../domvm'

import { MDCTopAppBar } from '@material/top-app-bar/index'

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

const TopAppBar = (...args) => {
  const [{ fixed, onNav, ...rest }, children] = hargs(args)
  return classify(
    fixed && 'mdc-top-app-bar--fixed',
    el(
      'header.mdc-top-app-bar',
      {
        ...rest,
        _key: rest._key || rest.id || 'mdcTopAppBar',
        _hooks: getHooks(onNav)
      },
      children
    )
  )
}

TopAppBar.Row = (...args) => h('.mdc-top-app-bar__row', ...args)

TopAppBar.Section = (...args) => {
  const [{ alignStart, alignEnd, ...rest }, children] = hargs(args)
  return classify(
    alignStart && 'mdc-top-app-bar__section--align-start',
    alignEnd && 'mdc-top-app-bar__section--align-end',
    el('section.mdc-top-app-bar__section', rest, children)
  )
}

TopAppBar.Icon = (...args) => {
  const [{ navigation, ...rest }, children] = hargs(args)
  return classify(
    navigation && 'mdc-top-app-bar__navigation-icon',
    el('a.material-icons', rest, children)
  )
}

export default TopAppBar
