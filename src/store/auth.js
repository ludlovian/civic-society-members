'use strict'

import * as backend from '../lib/backend'
import { loadFromLocal, saveToLocal } from '../lib/local'
import config from '../config'

export default {
  initial: {
    username: '',
    token: '',
    loginTimestamp: undefined,
    signedOut: false,
    spreadsheetId: undefined
  },

  actions: ({ state, update, actions }) => {
    function storeCreds ({ username, token }) {
      update({
        username,
        token,
        loginTimestamp: Date.now()
      })
    }

    function storeConfig ({ spreadsheet: spreadsheetId }) {
      update({ spreadsheetId })
    }

    function signIn (creds) {
      const { username } = creds
      return actions.engine.execute(async () => {
        const { token } = await backend.authUser(creds)
        storeCreds({ username, token })
        const { spreadsheet } = await backend.fetchConfig()
        storeConfig({ spreadsheet })
        actions.members.fetchAll()
      })
    }

    function signOut () {
      actions.members.clear()
      update({
        username: '',
        token: '',
        loginTimestamp: undefined,
        signedOut: true
      })
    }

    function init () {
      const data = loadFromLocal({ key: 'auth' })
      update({ ...data, signedOut: false })
    }

    function start () {
      state.on(snap => {
        saveToLocal({ key: 'auth' }, snap)
      })
    }

    return {
      init,
      start,
      signIn,
      signOut
    }
  },

  views: ({ state }) => ({
    signedIn: state.map(({ token }) => !!token),
    signedOut: state.map(({ signedOut }) => signedOut),
    token: state.map(({ token }) => token),
    user: state.map(({ username }) => username),
    config: state.map(({ spreadsheetId }) => {
      if (!spreadsheetId) return
      const sheetId = spreadsheetId[config.isTest ? 'test' : 'live']
      return {
        spreadsheetId: sheetId,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/`
      }
    })
  })
}
