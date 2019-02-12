'use strict'

import h from './hyperscript'

export default function breakLines (lines) {
  const out = []
  for (let i = 0; i < lines.length; i++) {
    if (i) out.push(<br _key={i} />)
    out.push(lines[i])
  }
  return out
}
