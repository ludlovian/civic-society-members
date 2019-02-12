'use strict'

let queue = []
let requested

const asap = (() => {
  if (typeof Promise === 'function') {
    let base = Promise.resolve()
    return fn => base.then(fn)
  }
  if (typeof setImmediate === 'function') {
    return setImmediate
  }
  return setTimeout
})()

export default function defer (cb) {
  queue.push(cb)
  if (!requested) {
    requested = true
    asap(execute)
  }
}

function execute () {
  while (true) {
    const cb = queue.shift()
    if (!cb) break
    cb()
  }
  requested = false
}
