'use strict'

import m from 'mithril'

import { MDCTabBar } from '@material/tab-bar'

import classify from '../../lib/classify'
import valoo from '../../lib/valoo'

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
  let activeTab
  let initialTab
  let tabs
  let attrOnChange

  function onChange (e) {
    activeTab(tabs[e.detail.index])
    if (attrOnChange) attrOnChange(e)
  }

  return {
    oninit ({ children, attrs }) {
      tabs = children
        .map(child => child.attrs && child.attrs.tab)
        .filter(Boolean)
      activeTab = valoo(attrs.tab || tabs[0])
      initialTab = activeTab()
      activeTab.on(m.redraw)
    },

    view ({ children, attrs }) {
      const {
        tab,
        xattrs = {},
        ...rest } = attrs

      attrOnChange = xattrs.onchange

      const activeChild = children
        .find(child => child.attrs && child.attrs.tab === activeTab())

      if (!activeChild) return false

      // render the tab with the *initial* tab, so that we do not
      // re-render, but let the Material JS handle it
      // but we render the content with the *active* tab
      return m('div', { ...rest },
        m(TabBar,
          {
            xattrs: { onchange: onChange }
          },
          tabs.map(t =>
            m(TabBar.Tab,
              { active: t === initialTab },
              m(TabBar.TabText, t)
            )
          )
        ),

        activeChild
      )
    }
  }
}
