'use strict'

import store from '../store'

export default {
  oncreate () {
    const url = store.auth.getConfig().spreadsheetUrl
    window.open(url, '_blank')
    window.history.back()
  },

  view () { return false }
}
