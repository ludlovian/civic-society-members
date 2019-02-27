'use strict'

import { P, PS } from 'patchinko'
import teme from 'teme'

import engine from './engine'
import auth from './auth'
import members from './members'
import route from './route'

let currentAction

function makeStore (parts) {
  const update = teme() // of patchinko patches

  const initial = Object.entries(parts).reduce(
    (o, [k, part]) => ({ ...o, [k]: part.initial }),
    {}
  )
  // state is derived from the updates and the initial state
  const state = update.scan((prev, patch) => P({}, prev, patch), initial)
  if (process.env.NODE_ENV !== 'production') hookDevTools(state)

  // functions which insert into `update`
  const actions = {}
  // derived streams
  const views = {}

  Object.entries(parts).forEach(([k, part]) => {
    const scopedUpdate = (patch, action = 'update') => {
      currentAction = action
      update({ [k]: PS({}, patch) })
    }
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

function hookDevTools (state) {
  const extension =
    window.__REDUX_DEVTOOLS_EXTENSION__ ||
    window.top.__REDUX_DEVTOOLS_EXTENSION__
  if (!extension) return

  const devtools = extension.connect()
  devtools.init(state())
  state.subscribe(s => devtools.send(currentAction, s))
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
