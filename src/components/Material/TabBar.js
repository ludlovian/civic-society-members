'use strict'

import m from 'mithril'

import { MDCTabBar } from '@material/tab-bar'

import { classnames } from '../../lib/classify'

export default function TabBar () {
  let control

  return {
    oncreate ({ dom, attrs }) {
      const { xattrs = {} } = attrs
      control = new MDCTabBar(dom)
      if (xattrs.onchange) {
        control.listen('MDCTabBar:activated', xattrs.onchange)
      }
    },

    onremove ({ attrs }) {
      const { xattrs = {} } = attrs
      if (xattrs.onchange) {
        control.unlisten('MDCTabBar:activated', xattrs.onchange)
      }
      control.destroy()
    },

    view ({ children, attrs }) {
      const { className, xattrs, ...rest } = attrs
      const cl = classnames(className, 'mdc-tab-bar')

      return (
        <div className={cl} {...xattrs} {...rest} role='tablist'>
          <div className='mdc-tab-scroller'>
            <div className='mdc-tab-scroller__scroll-area'>
              <div className='mdc-tab-scroller__scroll-content'>{children}</div>
            </div>
          </div>
        </div>
      )
    }
  }
}

TabBar.Tab = {
  view ({ children, attrs }) {
    const { className, active, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-tab', {
      'mdc-tab--active': active
    })

    return (
      <button
        className={cl}
        {...xattrs}
        {...rest}
        role='tab'
        aria-selected={active}
        tabindex={active ? '0' : '-1'}
      >
        <span className='mdc-tab__content'>{children}</span>

        <span
          className={classnames(
            'mdc-tab-indicator',
            active && 'mdc-tab-indicator--active'
          )}
        >
          <span className='mdc-tab-indicator__content mdc-tab-indicator__content--underline' />
        </span>

        <span className='mdc-tab__ripple' />
      </button>
    )
  }
}

TabBar.TabIcon = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'material-icons', 'mdc-tab__icon')

    return (
      <span className={cl} {...xattrs} {...rest}>
        {children}
      </span>
    )
  }
}

TabBar.TabText = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-tab__text-label')

    return (
      <span className={cl} {...xattrs} {...rest}>
        {children}
      </span>
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
      const { ontabchange, tab, xattrs = {}, ...rest } = attrs
      _onchange = xattrs.onchange
      _ontabchange = ontabchange

      tabs = children
        .map(child => child.attrs && child.attrs.tab)
        .filter(Boolean)
      const activeTab = tabs.find(t => t === tab) || tabs[0]
      const activeChild = children.find(
        child => child.attrs && child.attrs.tab === activeTab
      )
      if (!activeChild) return false

      return (
        <div {...rest}>
          <TabBar xattrs={{ onchange }}>
            {tabs.map(t => (
              <TabBar.Tab active={t === activeTab}>
                <TabBar.TabText>{t}</TabBar.TabText>
              </TabBar.Tab>
            ))}
          </TabBar>
          {activeChild}
        </div>
      )
    }
  }
}
