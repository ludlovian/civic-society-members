'use strict'

import { el, vw } from '../domvm'

import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Router from '../routes'
import stream from '../lib/stream'

export default function App () {
  let openSidebar = stream()
  function onNav () {
    openSidebar(true)
  }

  return vm => {
    return el('div', { id: 'app' }, [
      vw(Sidebar, { open: openSidebar }),
      vw(Topbar, { onNav }),
      vw(Router)
    ])
  }
}
