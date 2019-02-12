'use strict'

import h from '../../lib/hyperscript'

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

const TabBar = {
  template ({ children, class: cl, onchange, id, ...rest }) {
    cl = classnames(cl, 'mdc-tab-bar')

    const attrs = {
      _hooks: getHooks(onchange),
      _key: id + '-mdc-tab-bar'
    }
    return (
      <div class={cl} {...rest} {...attrs} role='tablist'>
        <div class='mdc-tab-scroller'>
          <div class='mdc-tab-scroller__scroll-area'>
            <div class='mdc-tab-scroller__scroll-content'>{children}</div>
          </div>
        </div>
      </div>
    )
  }
}

TabBar.Tab = {
  template ({ children, class: cl, active, ...rest }) {
    cl = classnames(cl, 'mdc-tab', active && 'mdc-tab--active')

    return (
      <button
        class={cl}
        {...rest}
        role='tab'
        aria-selected={active}
        tabindex={active ? '0' : '-1'}
      >
        <span class='mdc-tab__content'>{children}</span>

        <span
          class={classnames(
            'mdc-tab-indicator',
            active && 'mdc-tab-indicator--active'
          )}
        >
          <span class='mdc-tab-indicator__content mdc-tab-indicator__content--underline' />
        </span>

        <span class='mdc-tab__ripple' />
      </button>
    )
  }
}

TabBar.TabIcon = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'material-icons', 'mdc-tab__icon')

    return (
      <span class={cl} {...rest}>
        {children}
      </span>
    )
  }
}

TabBar.TabText = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-tab__text-label')

    return (
      <span class={cl} {...rest}>
        {children}
      </span>
    )
  }
}

TabBar.AutoTab = {
  render (vm, { children, ontabchange, onchange, tab, ...rest }) {
    const tabs = children
      .map(child => child.data && child.data.tab)
      .filter(Boolean)
    const activeTab = tabs.find(t => t === tab) || tabs[0]
    const activeChild = children.find(
      child => child.data && child.data.tab === activeTab
    )
    if (!activeChild) return false

    function _onchange (e) {
      const tab = tabs[e.detail.index]
      if (onchange) onchange(e)
      if (ontabchange) ontabchange(tab)
      vm.update({ ...vm.data, tab })
    }

    return (
      <div {...rest}>
        <TabBar onchange={_onchange}>
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

export default TabBar
