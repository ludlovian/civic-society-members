'use strict'

import { P, PS } from 'patchinko'
import stream from '../lib/stream'

import engine from './engine'
import auth from './auth'
import members from './members'
import route from './route'

function makeStore (parts) {
  const update = stream() // of patchinko patches

  const initial = Object.entries(parts).reduce(
    (o, [k, part]) => ({ ...o, [k]: part.initial }),
    {}
  )
  // state is derived from the updates and the initial state
  const state = update.scan((prev, patch) => P({}, prev, patch), initial)

  // functions which insert into `update`
  const actions = {}
  // derived streams
  const views = {}

  Object.entries(parts).forEach(([k, part]) => {
    const scopedUpdate = patch => update({ [k]: PS({}, patch) })
    const scopedState = state.map(s => s[k]).dedupe()
    actions[k] = part.actions({
      state: scopedState,
      update: scopedUpdate,
      actions,
      views
    })
    views[k] = part.views({ state: scopedState, views })
  })

  function init () {
    Object.values(actions)
      .map(a => a.init)
      .filter(Boolean)
      .forEach(fn => fn())
  }

  function start () {
    Object.values(actions)
      .map(a => a.start)
      .filter(Boolean)
      .forEach(fn => fn())
  }

  return {
    state,
    actions,
    views,
    init,
    start
  }
}

const { state, actions, views, init, start } = makeStore({
  engine,
  auth,
  members,
  route
})

window.store = { state, actions, views, init, start }

export default state
export { state, actions, views, start, init }
