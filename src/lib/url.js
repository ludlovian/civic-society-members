'use strict'

export function buildQuery (q) {
  const parts = Object.entries(q)
    .filter(([k, v]) => v != null && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}=${v}`))
  return parts.length ? '?' + parts.join('&') : ''
}
