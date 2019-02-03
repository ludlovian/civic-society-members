'use strict'

import m from 'mithril'
import valoo from '../lib/valoo'

import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function Layout () {
  let drawerOpen = valoo(false)
  drawerOpen.on(m.redraw)

  function openDrawer () {
    drawerOpen(true)
  }

  function closeDrawer () {
    if (!drawerOpen()) return
    drawerOpen(false)
  }

  return {
    view ({ children, attrs: { includeSearch } }) {
      return m(
        'div#app',
        m(Sidebar, {
          open: drawerOpen(),
          onClose: closeDrawer
        }),

        m(Topbar, {
          onNav: openDrawer,
          includeSearch
        }),

        m('div.mdc-top-app-bar--fixed-adjust.mdc-theme--background', children)
      )
    }
  }
}
