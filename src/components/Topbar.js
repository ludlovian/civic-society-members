'use strict'

import { el, vw } from '../domvm'

import { TopAppBar, Typography, Icon } from 'domvm-material'
import teme from 'teme'

import MemberSearch from './MemberSearch'
import MediaQuery from './MediaQuery'
import { views, actions } from '../store'
import stylish from 'stylish'
import config from '../config'

const style = stylish`
  .title {
    padding-left: 20px;
  }

  .test {
    padding-left: 5px;
  }

  .engine-status {
    color: white;
    font-size: 20px;
    padding-left: 8px;
  }
`

export default function Topbar (vm) {
  let hasSearch = views.route.state.map(s => s.page === 'home')
  hasSearch.subscribe(() => vm.redraw())

  return {
    hooks: {
      willUnmount: () => hasSearch.end(true)
    },
    render: (vm, { onNav }) =>
      TopAppBar(
        {
          class: style,
          fixed: true,
          onNav
        },
        TopAppBar.Row(
          TopAppBar.Section(
            { alignStart: true },
            TopAppBar.Icon({ navigation: true }, 'menu'),
            AppTitle(),
            IsTest(),
            vw(EngineStatus)
          ),
          hasSearch() && vw(MemberSearch)
        )
      )
  }
}

const AppTitle = () =>
  Typography.Headline5(
    { onclick: actions.members.fetchAll },
    vw(MediaQuery, {
      match: '(max-width:640px)',
      render: matches => el('span', matches ? 'LCS' : 'Ludlow Civic Society')
    })
  )

const IsTest = () =>
  config.isTest && Typography.Body1({ class: 'test' }, '(test)')

function toError () {
  actions.route.toPage('error')
}

function EngineStatus (vm) {
  let monitor = teme.merge(views.engine.status)
  monitor.subscribe(() => vm.redraw())

  const states = {
    idle: [],
    busy: ['sync'],
    disconnected: ['cloud_off'],
    error: ['error', toError, '/error']
  }

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },
    render () {
      let [icon, target, href] = states[views.engine.status()]
      if (!icon) return el('span')
      icon = Icon({ class: 'engine-status' }, icon)
      if (!target) return icon
      const onclick = e => {
        target()
        return false
      }
      return el('a', { href, onclick: [onclick] }, icon)
    }
  }
}
