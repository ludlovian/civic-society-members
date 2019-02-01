'use strict'

import '@babel/polyfill'

import m from 'mithril'
import './style/index.scss'

import routes from './routes'
import store from './store'

store.on(m.redraw)

if (process.env.NODE_ENV !== 'production') {
  window.m = m
  window.store = store
}

if (store.auth.isSignedIn() && !store.members.wasLoadedRecently()) {
  store.members.fetchMembers()
}

m.route.prefix('')
m.route(document.body, '/', routes)
