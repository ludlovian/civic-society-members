'use strict'

import { loadFromLocal, saveToLocal } from '../lib/local'
import * as backend from '../lib/backend'

export default {
  data: {
    members: {},
    files: [],
    loaded: 0,
    filesLoaded: false
  },

  actions: self => ({
    storeMembers (_, members) {
      if (!self.root.auth.isSignedIn()) return null
      return {
        loaded: Date.now(),
        members
      }
    },

    storeFiles (_, files) {
      if (!self.root.auth.isSignedIn()) return null
      return {
        files,
        filesLoaded: true
      }
    },

    replaceMember ({ members }, member) {
      const { auth, engine } = self.root
      if (!auth.isSignedIn()) return
      engine
        .onIdle()
        .then(() =>
          engine.execute(() =>
            backend.postMember({ member, token: auth.getToken() })
          )
        )
      return {
        members: {
          ...members,
          [member.id]: member
        }
      }
    },

    updateMember (_, member, patch) {
      if (!Object.keys(patch).length) return
      const txn = {
        date: Date.now(),
        user: self.root.auth.getUser(),
        member: {
          id: member.id,
          ...patch
        }
      }
      self.replaceMember({
        ...member,
        ...patch,
        history: [...member.history, txn]
      })
    },

    addPayment (_, member, payment) {
      const pmt = {
        id: member.id,
        ...payment
      }
      const txn = {
        date: Date.now(),
        user: self.root.auth.getUser(),
        payment: pmt
      }
      self.replaceMember({
        ...member,
        payments: [...member.payments, pmt],
        history: [...member.history, txn]
      })
    },

    async fetchMembers () {
      const { auth, engine } = self.root
      if (!auth.isSignedIn()) return
      return engine.execute(async () => {
        const token = auth.getToken()
        self.storeMembers(await backend.fetchMembers({ token }))
      })
    },

    async fetchFiles () {
      const { auth, engine } = self.root
      if (!auth.isSignedIn()) return
      return engine.execute(async () => {
        const token = auth.getToken()
        self.storeFiles(await backend.fetchFiles({ token }))
      })
    },

    fetchAll () {
      return Promise.all([self.fetchMembers(), self.fetchFiles()]).then(
        () => null
      )
    },

    ensureFilesLoaded ({ filesLoaded }) {
      if (filesLoaded) return
      return self.fetchFiles()
    },

    clear: () => ({
      members: {},
      files: [],
      loaded: 0,
      filesLoaded: false
    }),

    addNewMember ({ members }, id) {
      const fields = 'sortName address tel email type notes postType giftAid usualMethod'.split(
        ' '
      )
      const mbr = { id }
      fields.forEach(k => {
        mbr[k] = ''
      })
      mbr.payments = []
      mbr.history = []
      return {
        members: {
          ...members,
          [id]: mbr
        }
      }
    },

    onInit () {
      const data = loadFromLocal({ key: 'members' })
      // reset filesLoaded
      return { ...data, filesLoaded: false }
    }
  }),

  onChange (snap) {
    // TODO - change compress to true before release
    saveToLocal({ key: 'members', compress: false }, snap)
  },

  views: self => ({
    isLoaded: ({ loaded }) => self.root.auth.isSignedIn() && !!loaded,

    wasLoadedRecently ({ loaded }, period = 10 * 60 * 1000) {
      return self.root.auth.isSignedIn() && Date.now() - loaded < period
    },

    members: ({ members }) => members,

    getMember ({ members, files }, id) {
      const member = members[id]
      if (!member) return
      id = parseInt(id)
      return {
        ...member,
        files: files.filter(f => f.id === id)
      }
    },

    getNewMember ({ members }) {
      const id = 1 + Math.max(...Object.values(members).map(m => m.id))
      self.addNewMember(id)
      return self.getMember(id)
    }
  })
}
