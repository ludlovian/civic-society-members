'use strict'

import { h, el, hargs } from '../../domvm'
import { MDCTabBar } from '@material/tab-bar'
import classnames from 'classnames'
import memoize from '../../lib/memoize'

const getHooks = memoize(onchange => ({
  didInsert (node) {
    const data = (node.data = node.data || {})
    const mdcTabBar = (data.mdcTabBar = new MDCTabBar(node.el))
    if (onchange) mdcTabBar.listen('MDCTabBar:activated', onchange)
  },

  willRecycle (prev, node) {
    node.data = prev.data
  },

  willRemove (node) {
    const { data } = node
    const { mdcTabBar } = data
    if (onchange) mdcTabBar.unlisten('MDCTabBar:activated', onchange)
    mdcTabBar.destroy()
  }
}))

export default function TabBar (...args) {
  const [{ onchange, id, ...rest }, children] = hargs(args)
  return el(
    '.mdc-tab-bar',
    {
      ...rest,
      _hooks: getHooks(onchange),
      _key: id + '-mdc-tab-bar',
      role: 'tablist'
    },
    el(
      '.mdc-tab-scroller',
      el(
        '.mdc-tab-scroller__scroll-area',
        el('.mdc-tab-scroller__scroll-content', children)
      )
    )
  )
}

TabBar.Tab = (...args) => {
  const [{ active, ...rest }, children] = hargs(args)
  return el(
    'button.mdc-tab',
    {
      ...rest,
      class: classnames(rest.class, active && 'mdc-tab--active'),
      role: 'tab',
      'aria-selected': active,
      tabindex: active ? '0' : '-1'
    },
    el('span.mdc-tab__content', children),
    el(
      'span.mdc-tab-indicator',
      {
        class: classnames(active && 'mdc-tab-indicator--active')
      },
      el(
        'span.mdc-tab-indicator__content.mdc-tab-indicator__content--underline'
      )
    ),
    el('span.mdc-tab__ripple')
  )
}

TabBar.TabIcon = (...args) => h('span.material-icons.mdc-tab__icon', ...args)

TabBar.TabText = (...args) => h('span.mdc-tab__text-label', ...args)
