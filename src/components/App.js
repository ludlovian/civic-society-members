'use strict'

import h from '../lib/hyperscript'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Router from '../routes'
import stream from '../lib/stream'

export default function App () {
  let openSidebar = stream()
  function onNav () {
    openSidebar(true)
  }

  return (vm, data) => {
    return (
      <div id='app'>
        <Sidebar open={openSidebar} />
        <Topbar onNav={onNav} />
        <Router />
      </div>
    )
  }
}
