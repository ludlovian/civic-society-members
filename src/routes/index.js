'use strict'

import { el, vw } from '../domvm'
import teme from 'teme'

import Logout from './Logout'
import Login from './Login'
import AppError from './Error'
import NotFound from './NotFound'
import MemberList from './MemberList'
import Member from './Member'
import Spreadsheet from './Spreadsheet'
import NewMember from './NewMember'
import { views, actions } from '../store'

const PERMITTED_UNAUTH = ['login', 'logout', 'error', '404']
const DISALLOWED_AUTH = ['login']

const PAGES = {
  home: MemberList,
  member: Member,
  newmember: NewMember,
  spreadsheet: Spreadsheet,
  login: Login,
  logout: Logout,
  error: AppError
}

export default function Router (vm) {
  const monitor = teme.merge(views.route.state)
  monitor.subscribe(() => vm.redraw())

  return {
    hooks: {
      willUmount: () => monitor.end(true)
    },
    render () {
      const { page, data } = views.route.state()
      const isSignedIn = views.auth.signedIn()

      if (!isSignedIn && PERMITTED_UNAUTH.indexOf(page) === -1) {
        actions.route.toPage('login', {}, true)
        vm.redraw()
        return el('div')
      }

      if (isSignedIn && DISALLOWED_AUTH.indexOf(page) !== -1) {
        actions.route.toPage('home', {}, true)
        vm.redraw()
        return el('div')
      }

      return el(
        '.mdc-top-app-bar--fixed-adjust.mdc-theme--background',
        vw(PAGES[page] || NotFound, data)
      )
    }
  }
}
