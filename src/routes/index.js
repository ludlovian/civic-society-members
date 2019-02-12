'use strict'

import h from '../lib/hyperscript'

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

export default function Router () {
  function didMount (vm) {
    vm.state = { monitor: views.route.state.map(() => vm.redraw()) }
  }
  function willUnmount (vm) {
    vm.state.monitor.end(true)
  }

  function render (vm) {
    const { page, data } = views.route.state()
    const isSignedIn = views.auth.signedIn()

    if (!isSignedIn && PERMITTED_UNAUTH.indexOf(page) === -1) {
      actions.route.toPage('login', {}, true)
      vm.redraw()
      return <div />
    }

    if (isSignedIn && DISALLOWED_AUTH.indexOf(page) !== -1) {
      actions.route.toPage('home', {}, true)
      vm.redraw()
      return <div />
    }

    const PageView = getView(page)
    return (
      <div class='mdc-top-app-bar--fixed-adjust mdc-theme--background'>
        <PageView {...data} />
      </div>
    )
  }
  return { render, hooks: { didMount, willUnmount } }
}

function getView (page) {
  switch (page) {
    case 'home':
      return MemberList
    case 'member':
      return Member
    case 'newmember':
      return NewMember
    case 'spreadsheet':
      return Spreadsheet
    case 'login':
      return Login
    case 'logout':
      return Logout
    case 'error':
      return AppError
    default:
      return NotFound
  }
}
