'use strict'

import { S } from 'patchinko'

export default {
  initial: {
    connected: false,
    error: undefined,
    running: 0
  },

  actions: ({ update }) => {
    function updateRunning (chg) {
      update({ running: S(n => n + chg) })
    }
    function setError (error) {
      update({ error })
    }

    async function execute (fn) {
      updateRunning(+1)
      try {
        await Promise.resolve(fn())
      } catch (e) {
        setError(e)
      } finally {
        updateRunning(-1)
      }
    }

    function start () {
      function check () {
        update({ connected: window.navigator.onLine })
      }
      window.addEventListener('offline', check)
      window.addEventListener('online', check)
      check()
    }

    return {
      start,
      execute,
      setError,
      clearError: () => setError(undefined)
    }
  },

  views: ({ state }) => ({
    state,
    status: state
      .map(({ connected, running, error }) => {
        if (error) return 'error'
        if (!connected) return 'disconnected'
        if (running) return 'busy'
        return 'idle'
      })
      .dedupe(),
    idle: state.when(s => !s.error && s.connected && s.running === 0)
  })
}
