'use strict'

import { PS, P, S } from 'patchinko'

import { loadFromLocal, saveToLocal } from '../lib/local'
import * as backend from '../lib/backend'

export default {
  initial: {
    members: {},
    files: [],
    loaded: 0,
    filesLoaded: false
  },

  actions: ({ state, views, update, actions }) => {
    //
    // local store updates
    //
    function storeMembers (members) {
      update({ members, loaded: Date.now() })
    }

    function storeFiles (files) {
      update({ files, filesLoaded: true })
    }

    function storeMember (member) {
      update({
        members: PS({}, { [member.id]: member })
      })
    }

    function clear () {
      update({
        members: {},
        files: [],
        loaded: 0,
        filesLoaded: false
      })
    }

    //
    // backend calls
    //
    function fetchMembers () {
      return actions.engine.execute(async () => {
        const token = views.auth.token()
        if (!token) return
        storeMembers(await backend.fetchMembers({ token }))
      })
    }

    function fetchFiles (always = false) {
      if (!always && state().filesLoaded) return
      return actions.engine.execute(async () => {
        const token = views.auth.token()
        if (!token) return
        storeFiles(await backend.fetchFiles({ token }))
      })
    }

    function fetchAll () {
      return Promise.all([fetchMembers(), fetchFiles(true)])
    }

    async function postMember (member) {
      await views.engine.idle()
      const token = views.auth.token()
      if (!token) return
      return actions.engine.execute(() => backend.postMember({ member, token }))
    }

    function storeAndPostMember (member) {
      storeMember(member)
      postMember(member)
    }

    //
    // business logic
    //
    function updateMember (member, patch) {
      if (!Object.keys(patch).length) return
      const txn = {
        date: Date.now(),
        user: views.auth.user(),
        member: {
          id: member.id,
          ...patch
        }
      }
      member = P({}, member, patch, { history: S(txns => txns.concat(txn)) })
      storeAndPostMember(member)
    }

    function addPayment (member, pmt) {
      pmt = P({}, { id: member.id }, pmt)
      const txn = {
        date: Date.now(),
        user: views.auth.user(),
        payment: pmt
      }
      member = P({}, member, {
        payments: S(pmts => pmts.concat(pmt)),
        history: S(txns => txns.concat(txn))
      })
      storeAndPostMember(member)
    }

    function createMember () {
      const fields = 'sortName address tel email type notes postType giftAid usualMethod'.split(
        ' '
      )
      const id =
        1 + Math.max(...Object.values(state().members).map(mbr => mbr.id))
      const mbr = P({ id }, fields.reduce((o, k) => ({ ...o, [k]: '' }), {}), {
        payments: [],
        history: []
      })
      storeMember(mbr)
      return mbr
    }

    function init () {
      const data = loadFromLocal({ key: 'members' })
      update({ ...data, filesLoaded: false })
    }

    function start () {
      if (views.auth.signedIn() && !views.members.loadedRecently()) {
        actions.members.fetchMembers()
      }
      state.on(snap => {
        saveToLocal({ key: 'members' }, snap)
      })
    }

    return {
      init,
      start,
      clear,
      fetchAll,
      fetchMembers,
      fetchFiles,
      updateMember,
      addPayment,
      createMember
    }
  },

  views: ({ state }) => ({
    // streams
    loaded: state.map(s => s.loaded).dedupe(),
    members: state.map(s => s.members),

    // functions
    loadedRecently (period = 10 * 60 * 1000) {
      return Date.now() - state().loaded < period
    },

    member (id) {
      id = parseInt(id)
      const { members, files } = state()
      const member = members[id]
      if (!member) return
      return P({}, member, { files: files.filter(f => f.id === id) })
    }
  })
}
