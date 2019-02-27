'use strict'

const HOP = Object.prototype.hasOwnProperty

export function shallow (a, b) {
  return (
    a === b ||
    (a &&
      b &&
      typeof a === 'object' &&
      typeof b === 'object' &&
      Object.keys(b).every(k => HOP.call(a, k)) &&
      Object.keys(a).every(k => a[k] === b[k]))
  )
}
