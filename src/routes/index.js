'use strict'

import m from 'mithril'

import store from '../store'

import Layout from '../components/Layout'
import NotFound from './NotFound'
import AppError from './Error'
import Logout from './Logout'
import Login from './Login'
import MemberList from './MemberList'
import Member from './Member'
import Spreadsheet from './Spreadsheet'

// const Member = { view: vnode => m('h3', `Member: ${JSON.stringify(vnode.attrs)}`) }

const { isSignedIn } = store.auth

export default
{
  '/': authRoute(MemberList, true),
  '/member/:id': authRoute(Member),
  '/spreadsheet': authRoute(Spreadsheet),
  '/login': unauthRoute(Login),
  '/logout': route(Logout),
  '/error': route(AppError),
  '/:url': route(NotFound)
}

function authRoute (comp, includeSearch = false) {
  return {
    render (vnode) {
      if (isSignedIn()) return m(Layout, { includeSearch }, m(comp, vnode.attrs))
      m.route.set('/login')
      return m(Layout, m(Login))
    }
  }
}

function route (comp) {
  return { render (vnode) { return m(Layout, m(comp, vnode.attrs)) } }
}

function unauthRoute (comp) {
  return {
    render (vnode) {
      if (!isSignedIn()) return m(Layout, m(comp, vnode.attrs))
      m.route.set('/')
      return m(Layout, { includeSearch: true }, m(MemberList, vnode.attrs))
    }
  }
}
