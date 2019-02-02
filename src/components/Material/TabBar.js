'use strict'

import m from 'mithril'

import { MDCTabBar } from '@material/tab-bar'

import classify from '../../lib/classify'

export default
function TabBar () {
  let control

  return {
    oncreate ({ dom, attrs }) {
      const { xattrs = {} } = attrs
      control = new MDCTabBar(dom)
      if (xattrs.onchange) control.listen('MDCTabBar:activated', xattrs.onchange)
    },

    onremove ({ attrs }) {
      const { xattrs = {} } = attrs
      if (xattrs.onchange) control.unlisten('MDCTabBar:activated', xattrs.onchange)
      control.destroy()
    },

    view ({ children, attrs }) {
      const {
        className,
        xattrs,
        ...rest } = attrs
      return classify(
        className,
        'mdc-tab-bar',
        m('div', { ...rest, role: 'tablist' },
          m('div.mdc-tab-scroller',
            m('div.mdc-tab-scroller__scroll-area',
              m('div.mdc-tab-scroller__scroll-content',
                children
              )
            )
          )
        )
      )
    }
  }
}

TabBar.Tab = {
  view ({ children, attrs }) {
    const {
      className,
      active,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-tab',
      { 'mdc-tab--active': active },
      m('button',
        {
          ...xattrs,
          ...rest,
          role: 'tab',
          'aria-selected': active,
          tabindex: active ? '0' : '-1'
        },

        m('span.mdc-tab__content', children),

        classify(
          'mdc-tab-indicator',
          { 'mdc-tab-indicator--active': active },
          m('span',
            m('span.mdc-tab-indicator__content.mdc-tab-indicator__content--underline')
          )
        ),

        m('span.mdc-tab__ripple')
      )
    )
  }
}

TabBar.TabIcon = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'material-icons',
      'mdc-tab__icon',
      m('span', { ...xattrs, ...rest }, children)
    )
  }
}

TabBar.TabText = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-tab__text-label',
      m('span', { ...xattrs, ...rest }, children)
    )
  }
}

TabBar.AutoTab = function AutoTab () {
  let tabs
  let _onchange
  let _ontabchange

  function onchange (e) {
    const tab = tabs[e.detail.index]
    if (_onchange) _onchange(e)
    if (_ontabchange) _ontabchange(tab)
    m.redraw()
  }

  return {
    view ({ children, attrs }) {
      const {
        ontabchange,
        tab,
        xattrs = {},
        ...rest } = attrs
      _onchange = xattrs.onchange
      _ontabchange = ontabchange

      tabs = children
        .map(child => child.attrs && child.attrs.tab)
        .filter(Boolean)
      const activeTab = tabs.find(t => t === tab) || tabs[0]
      const activeChild = children
        .find(child => child.attrs && child.attrs.tab === activeTab)
      if (!activeChild) return false

      return m('div', { ...rest },
        m(TabBar,
          { xattrs: { onchange } },
          tabs.map(t =>
            m(TabBar.Tab,
              { active: t === activeTab },
              m(TabBar.TabText, t)
            )
          )
        ),

        activeChild
      )
    }
  }
}
