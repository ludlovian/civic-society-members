'use strict'

export default function dedupe (fn, cmp = identical, prev = undefined) {
  return v => {
    if (!cmp(prev, v)) fn(v)
    prev = v
  }
}

const HOP = Object.prototype.hasOwnProperty

const identical = (a, b) => a === b

const shallow = (a, b) =>
  a === b ||
  (a &&
    b &&
    typeof a === 'object' &&
    typeof b === 'object' &&
    Object.keys(a).every(k => a[k] === b[k]) &&
    Object.keys(b).every(k => HOP.call(a, k)))

const deep = (a, b) =>
  a === b ||
  (a &&
    b &&
    typeof a === 'object' &&
    typeof b === 'object' &&
    Object.keys(b).every(k => HOP.call(a, k)) &&
    Object.keys(a).every(k => deep(a[k], b[k])))

Object.assign(dedupe, { identical, shallow, deep })
