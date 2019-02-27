'use strict'

import { el, vw } from '../domvm'

import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Router from '../routes'
import teme from 'teme'

export default function App () {
  let openSidebar = teme(false)
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
