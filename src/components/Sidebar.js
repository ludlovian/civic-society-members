'use strict'

import { Drawer } from './Material'
import { version } from '../../package.json'
import stream from '../lib/stream'
import { views, actions } from '../store'
import config from '../config'

export default function Sidebar (vm) {
  const monitor = stream.combine(
    () => vm.redraw(),
    [views.auth.signedIn, views.route.state],
    { skip: true }
  )

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render (vm, { children, open, ...rest }) {
      // build the list of items in the sidebar
      const isSignedIn = views.auth.signedIn()
      const page = views.route.state().page
      const list = buildList(isSignedIn, page)

      return Drawer(
        { ...rest, open },
        Drawer.Header({ title: 'Menu', subtitle: 'v' + version }),
        Drawer.Content(
          list.map(({ selected, href, action, icon, text }) =>
            Drawer.Item(
              {
                selected,
                href: config.basePath + href,
                onclick: [onclick, action, open]
              },
              Drawer.ItemIcon(icon),
              Drawer.ItemText(text)
            )
          )
        )
      )
    }
  }
}

function onclick (action, open) {
  action()
  open(false)
  return false
}

function buildList (signedIn, page) {
  if (!signedIn) {
    return [
      {
        text: 'Login',
        icon: 'account_circle',
        action: () => actions.route.toPage('login'),
        href: '/login',
        selected: true
      }
    ]
  }

  const list = [
    {
      text: 'Members',
      icon: 'people',
      action: () => actions.route.toPage('home'),
      href: '/',
      selected: page === 'home'
    },
    page === 'member' && {
      text: 'Member details',
      icon: 'person',
      action: () => {},
      href: views.route.url(),
      selected: true
    },
    {
      text: 'New member',
      icon: 'person_add',
      href: '/member/new',
      action: () => actions.route.toPage('newmember')
    },
    {
      text: 'Spreadsheet',
      icon: 'grid_on',
      href: '/spreadsheet',
      action: () => actions.route.toPage('spreadsheet'),
      selected: page === 'spreadsheet'
    },
    {
      text: 'Log out',
      icon: 'close',
      href: '/logout',
      action: () => actions.route.toPage('logout'),
      selected: page === 'logout'
    }
  ].filter(Boolean)

  if (!list.some(item => item.selected)) list[0].selected = true
  return list
}
