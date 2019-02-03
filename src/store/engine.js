'use strict'

import Trigger from '../lib/trigger'
import PQueue from '../lib/pqueue'

/*
 * The engine single-paths the activity through a promise-gate.
 * This ensures that we are not reading & writing at the same time
 */
let _queue = PQueue({ concurrency: Infinity })
let _connected = Trigger()

export default {
  data: {
    busy: false,
    connected: false,
    error: undefined
  },

  actions: self => ({
    setBusy ({ busy }) {
      if (busy) return // already busy
      _queue.onIdle.then(self.setIdle)
      return { busy: true }
    },
    setIdle: () => ({ busy: false }),
    setError: (_, error) => ({ error }),
    clearError: () => ({ error: undefined }),
    setConnected (state, connected) {
      if (connected === state.connected) return null
      if (connected) {
        _connected.fire()
      } else {
        _connected = new Trigger()
      }
      return { connected }
    },

    //
    // schedules a promise-generating function, managing
    // the setting of busy and error details
    //
    // resolves to a null update once the function has run
    //
    execute (_, fn) {
      return _queue
        .push(async () => {
          await _connected
          self.setBusy()
          try {
            await Promise.resolve(fn())
          } catch (e) {
            self.setError(e)
          }
        })
        .then(() => undefined)
    },

    onInit () {
      function checkOnlineStatus () {
        self.setConnected(window.navigator.onLine)
      }
      window.addEventListener('offline', checkOnlineStatus)
      window.addEventListener('online', checkOnlineStatus)
      checkOnlineStatus()
    }
  }),

  views: self => ({
    hasError: ({ error }) => !!error,
    getError: ({ error }) => error,
    isConnected: ({ connected }) => connected,
    isActive: ({ busy }) => !self.hasError() && busy,
    onIdle: () => _queue.onIdle,
    onConnected: () => _connected,
    getStatus: ({ busy, connected, error }) =>
      error ? 'error' : !connected ? 'disconnected' : busy ? 'busy' : 'idle'
  })
}
