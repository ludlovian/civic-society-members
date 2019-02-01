'use strict'

import m from 'mithril'

export default function breakLines (lines) {
  const out = []
  for (let i = 0; i < lines.length; i++) {
    if (i) out.push(m('br'))
    out.push(lines[i])
  }
  return out
}
