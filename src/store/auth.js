'use strict'

import * as backend from '../lib/backend'
import { loadFromLocal, saveToLocal } from '../lib/local'
import config from '../config'

export default {
  data: {
    username: '',
    token: '',
    loginTimestamp: undefined,
    signedOut: false,
    spreadsheetId: undefined
  },

  actions: self => ({
    storeCreds: (_, { username, token }) => ({
      username,
      token,
      loginTimestamp: Date.now()
    }),

    storeConfig: (_, { spreadsheet: spreadsheetId }) => ({ spreadsheetId }),

    signIn (state, creds) {
      const { username } = creds
      return self.root.engine.execute(async () => {
        const { token } = await backend.authUser(creds)
        self.storeCreds({ username, token })
        const { spreadsheet } = await backend.fetchConfig()
        self.storeConfig({ spreadsheet })
        self.root.members.fetchAll()
      })
    },

    signOut () {
      self.root.members.clear()
      return {
        username: '',
        token: '',
        loginTimestamp: undefined,
        signedOut: true
      }
    },

    onInit () {
      const data = loadFromLocal({ key: 'auth' })
      return { ...data, signedOut: false }
    }
  }),

  views: self => ({
    isSignedIn: ({ token }) => !!token,
    isSignedOut: ({ signedOut }) => signedOut,
    getToken: ({ token }) => token,
    getUser: ({ username }) => username,

    getConfig ({ spreadsheetId }) {
      const sheetId = spreadsheetId[config.isTest ? 'test' : 'live']
      return {
        spreadsheetId: sheetId,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/`
      }
    }
  }),

  onChange: (snap) => saveToLocal({ key: 'auth' }, snap)
}
