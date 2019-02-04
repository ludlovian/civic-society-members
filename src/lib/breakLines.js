'use strict'

import m from 'mithril'

export default function breakLines (lines, br = <br />) {
  const out = []
  for (let i = 0; i < lines.length; i++) {
    if (i) out.push(br)
    out.push(lines[i])
  }
  return out
}
