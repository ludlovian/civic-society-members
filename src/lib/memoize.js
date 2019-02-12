'use strict'

// memoizes the last call, assumes one arg
export default function memoize (fn, cmp = memoize.shallow) {
  return (...args) => {
    if (!cmp(args, fn.lastArgs)) {
      fn.lastValue = fn(...args)
    }
    fn.lastArgs = args
    return fn.lastValue
  }
}

memoize.shallow = (a, b) =>
  a === b ||
  (a &&
    b &&
    typeof a === 'object' &&
    typeof b === 'object' &&
    Object.keys(a).every(k => a[k] === b[k]) &&
    Object.keys(b).every(k => Object.prototype.hasOwnProperty.call(a, k)))
