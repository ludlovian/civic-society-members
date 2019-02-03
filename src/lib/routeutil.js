'use strict'

import m from 'mithril'

const reRoute = /([^?#]*)(?:\?([^#]*))?(?:#(.*))?/

export function getRoute () {
  const match = reRoute.exec(m.route.get())
  return {
    path: match[1],
    query: m.parseQueryString(match[2] || ''),
    fragment: match[3] || ''
  }
}

export function setRoute ({ path, query, fragment }, { replace = false } = {}) {
  const s =
    (path || '') +
    (query ? '?' + m.buildQueryString(query) : '') +
    (fragment ? '#' + fragment : '')
  m.route.set(s, null, { replace })
}
