'use strict'

import m from 'mithril'
import valoo from './valoo'
import throttle from 'lodash/throttle'

const windowSize = valoo({
  width: undefined,
  height: undefined,
  measured: false
})

function updateSize () {
  windowSize({
    width: window.innerWidth,
    height: window.innerHeight,
    measured: true
  })
}

updateSize()
window.addEventListener('resize', updateSize)
windowSize.on(throttle(m.redraw, 100, { leading: false }))

function inRange (from, to) {
  const ws = windowSize()
  return ws.measured && ws.width >= from && ws.width < to
}

export default {
  get measured () { return windowSize().measured },
  get width () { return windowSize().width },
  get height () { return windowSize().height },
  get isSmall () { return inRange(0, 640) },
  get isMedium () { return inRange(640, 1024) },
  get isLarge () { return inRange(1024, 1250) },
  get isExtraLarge () { return inRange(1250, Infinity) }
}
