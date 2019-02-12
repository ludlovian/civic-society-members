'use strict'

import h from '../lib/hyperscript'

import TopAppBar from './Material/TopAppBar'
import Typography from './Material/Typography'
import Icon from './Material/Icon'

import MemberSearch from './MemberSearch'
import MediaQuery from './MediaQuery'
import { views, actions } from '../store'
import stylish from '../lib/stylish'
import config from '../config'

const style = `
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

export default function Topbar () {
  let cleanup

  let hasSearch = views.route.state.map(s => s.page === 'home')

  function willMount (vm) {
    cleanup = hasSearch.on(() => vm.redraw())
  }

  function willUnmount (vm) {
    cleanup()
  }

  function render (vm, { onNav }) {
    const cl = stylish(style)
    return (
      <TopAppBar class={cl} fixed onNav={onNav}>
        <TopAppBar.Row>
          <TopAppBar.Section alignStart>
            <TopAppBar.Icon navigation>menu</TopAppBar.Icon>
            <AppTitle />
            <IsTest />
            <EngineStatus />
          </TopAppBar.Section>
          {hasSearch() && <MemberSearch />}
        </TopAppBar.Row>
      </TopAppBar>
    )
  }

  return { render, hooks: { willMount, willUnmount } }
}

const AppTitle = {
  template: () => (
    <Typography class='title' headline5 onclick={actions.members.fetchAll}>
      <MediaQuery match='(max-width:640px)'>
        {matches => <span>{matches ? 'LCS' : 'Ludlow Civic Society'}</span>}
      </MediaQuery>
    </Typography>
  )
}

const IsTest = {
  template: () =>
    config.isTest && (
      <Typography class='test' body1>
        (test)
      </Typography>
    )
}

function toError () {
  actions.route.toPage('error')
}

function EngineStatus () {
  let cleanup = []

  const states = {
    idle: [],
    busy: ['sync'],
    disconnected: ['cloud_off'],
    error: ['error', toError]
  }

  return {
    hooks: {
      didMount (vm) {
        cleanup = [views.engine.status.on(() => vm.redraw())]
      },
      willUnmount () {
        cleanup.forEach(f => f())
      }
    },
    render () {
      let [icon, target] = states[views.engine.status()]
      if (!icon) return <span />
      icon = <Icon class='engine-status'>{icon}</Icon>
      if (!target) return icon
      const onclick = e => {
        target()
        return false
      }
      return (
        <a href={target} onclick={[onclick]}>
          {icon}
        </a>
      )
    }
  }
}
