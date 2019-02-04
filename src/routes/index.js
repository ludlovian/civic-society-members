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

const { isSignedIn } = store.auth

export default {
  '/': authRoute(MemberList, true),
  '/member/:key': authRoute(Member),
  '/spreadsheet': authRoute(Spreadsheet),
  '/login': unauthRoute(Login),
  '/logout': route(Logout),
  '/error': route(AppError),
  '/:url': route(NotFound)
}

function authRoute (Comp, includeSearch = false) {
  return {
    render (vnode) {
      if (isSignedIn()) {
        return (
          <Layout includeSearch={includeSearch}>
            <Comp {...vnode.attrs} />
          </Layout>
        )
      }
      m.route.set('/login')
      return (
        <Layout>
          <Login />
        </Layout>
      )
    }
  }
}

function route (Comp) {
  return {
    render (vnode) {
      return (
        <Layout>
          <Comp {...vnode.attrs} />
        </Layout>
      )
    }
  }
}

function unauthRoute (Comp) {
  return {
    render (vnode) {
      if (!isSignedIn()) {
        return (
          <Layout>
            <Comp {...vnode.attrs} />
          </Layout>
        )
      }
      m.route.set('/')
      return (
        <Layout includeSearch>
          <MemberList />
        </Layout>
      )
    }
  }
}
