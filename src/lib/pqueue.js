'use strict'

import Trigger from './trigger'

export default function PQueue ({ concurrency = 1, limit = Infinity } = {}) {
  // queue of yet-to-run functions
  let queue = []
  let running = 0
  let idle = true
  let idlePromise = Trigger()
  idlePromise.fire()

  function push (fn) {
    return new Promise((resolve, reject) => {
      if (queue.length >= limit) {
        return reject(new Error('queue limit exceeded'))
      }
      const executor = () => {
        running++
        Promise.resolve()
          .then(() => fn())
          .then(
            val => {
              running--
              resolve(val)
              start()
            },
            err => {
              running--
              reject(err)
              start()
            }
          )
      }
      queue.push(executor)
      start()
    })
  }

  function start () {
    // too many?
    if (running >= concurrency) {
      return
    }
    // any left
    if (queue.length) {
      if (idle) {
        idle = false
        idlePromise = Trigger()
      }
      queue.shift()()
    } else {
      if (!running && !idle) {
        idle = true
        idlePromise.fire()
      }
    }
  }

  function clear () {
    queue = []
  }

  return {
    push,
    clear,
    get pending () {
      return queue.length
    },
    get running () {
      return running
    },
    get onIdle () {
      return idlePromise
    }
  }
}
window.PQueue = PQueue
window.Trigger = Trigger
