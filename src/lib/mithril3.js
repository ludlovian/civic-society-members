'use strict'

import m from 'mithril'

/*
 * A function to convert a Mithrilv3 componennt back into a v2 one
 *
 * Assumptions:
 * - Components are closure based
 * - v3 components are simply functions
 *    (vnode, prev, state, update) => prev | { view, next, onremove }
 *
 * v2 components are
 *   () => { <lifecyclehooks>, view } and state held as closure variables
 *
 * v2 lifecycle is
 *
 * 1st render
 *  oninit(vnode) -> view -> oncreate (next tick)
 *
 *  ...becomes comp3(vnode, undefined, update) -> { view, next, onremove }
 *
 * subsequent
 *  onbeforeupdate -> view
 *
 */

const queue = []
const promise = Promise.resolve()

function execute () {
  while (queue.length !== 0) {
    const cb = queue.shift()
    try {
      cb()
    } catch (e) {
      promise.then(() => {
        throw e
      })
    }
  }
}

function defer (callback) {
  if (queue.length === 0) promise.then(execute)
  queue.push(callback)
}

const mithril3 = component => () => {
  let state
  let view
  let skip
  let onremove

  function update (newState) {
    defer(() => {
      state = newState
      m.redraw()
    })
  }

  function callComponent (vnode, prev) {
    const ret = component(vnode, prev, state, update)
    skip = ret === prev
    if ('view' in ret) {
      view = ret.view
      state = ret.next
      onremove = ret.onremove
    } else {
      view = ret
    }
  }

  return {
    oninit (vnode) {
      callComponent(vnode, undefined)
    },
    onbeforeupdate (vnode, prev) {
      callComponent(vnode, prev)
      return skip
    },
    view () {
      return view
    },
    onremove () {
      if (onremove) onremove()
    }
  }
}

export default mithril3
export { mithril3, defer }
