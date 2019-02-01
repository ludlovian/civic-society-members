'use strict'

import Store from './Store'
import auth from './auth'
import engine from './engine'
import members from './members'

const store = Store.combine({
  engine: Store.load(engine),
  auth: Store.load(auth),
  members: Store.load(members)
})

export default store
