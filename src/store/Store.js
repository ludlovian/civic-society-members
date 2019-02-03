'use strict'

import valoo from '../lib/valoo'

const objForEach = (o, fn) => Object.entries(o).forEach(fn)

export default function Store () {
  // the returned store is actually just a valoo
  const store = valoo({})

  store.update = (update, ...args) => {
    if (update && Object.keys(update).length) {
      // console.log('store update', update)
      store({ ...store(), ...update }, ...args)
    }
  }

  Object.defineProperty(store, 'root', {
    configurable: true,
    get: () => (store.parent ? store.parent.root : store)
  })

  return store
}

function combine (stores) {
  const store = Store(Array.isArray(stores) ? [] : {})
  objForEach(stores, ([k, substore]) => {
    substore.parent = store
    store[k] = substore
    const update = subValue => {
      const curr = store()
      curr[k] = subValue
      store(curr)
    }
    update(substore())
    substore.on(update)
  })
  store.update = () => {
    throw new Error('cannot update a derived store')
  }
  return store
}

function load (def) {
  const store = Store()
  if (def.data) store(def.data)

  const actions =
    typeof def.actions === 'function' ? def.actions(store) : def.actions || {}
  objForEach(actions, ([k, fn]) => {
    store[k] = (...args) => {
      const ret = fn(store(), ...args)
      if (ret == null) return
      if (ret.then) return ret.then(u => store.update(u, k))
      return store.update(ret, k)
    }
  })

  const views =
    typeof def.views === 'function' ? def.views(store) : def.views || {}
  objForEach(views, ([k, fn]) => {
    store[k] = (...args) => fn(store(), ...args)
  })

  if (store.onInit) store.onInit()

  if (def.onChange) store.on(def.onChange)

  return store
}

Object.assign(Store, { load, combine })
