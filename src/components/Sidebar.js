'use strict'

import m from 'mithril'

import Drawer from './Material/Drawer'

import pdsp from '../lib/pdsp'
import store from '../store'

export default {
  view ({ attrs: { open, onClose } }) {
    const isSignedIn = store.auth.isSignedIn()
    const url = m.route.get()
    const list = buildList(isSignedIn, url)

    return (
      <Drawer open={open} close={onClose}>
        <Drawer.Header title='Menu' />
        <Drawer.Content>{renderList(list, onClose)}</Drawer.Content>
      </Drawer>
    )
  }
}

function renderList (list, onClose) {
  return list.map(({ selected, href, icon, text }) => {
    function onclick (e) {
      pdsp(e)
      m.route.set(href)
      setTimeout(onClose)
    }

    return (
      <Drawer.Item selected={selected} xattrs={{ href, onclick }}>
        <Drawer.ItemIcon>{icon}</Drawer.ItemIcon>
        <Drawer.ItemText>{text}</Drawer.ItemText>
      </Drawer.Item>
    )
  })
}

function buildList (isSignedIn, url) {
  if (!isSignedIn) {
    return [
      { text: 'Login', icon: 'account_circle', href: '/login', selected: true }
    ]
  }
  const list = []
  let selected
  list.push({ text: 'Members', icon: 'people', href: '/' })
  if (/^\/member\/\d+$/.test(url)) {
    list.push({ text: 'Member details', icon: 'person', href: url })
    selected = 1
  }
  list.push({ text: 'New member', icon: 'person_add', href: '/member/new' })
  list.push({ text: 'Spreadsheet', icon: 'grid_on', href: '/spreadsheet' })
  list.push({ text: 'Log out', icon: 'close', href: '/logout' })

  if (selected === undefined) {
    list.forEach((item, i) => {
      if (url === item.href) selected = i
    })
    if (selected === undefined) selected = 0
  }
  list[selected].selected = true
  return list
}
