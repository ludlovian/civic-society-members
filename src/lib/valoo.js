'use strict'

export default function valoo (value) {
  const listeners = []
  function func () {
    if (arguments.length) {
      value = arguments[0]
      listeners.forEach(cb => cb && cb.apply(this, arguments))
    }
    return value
  }
  func.on = cb => {
    const i = listeners.push(cb) - 1
    return () => {
      listeners[i] = undefined
    }
  }
  return func
}
