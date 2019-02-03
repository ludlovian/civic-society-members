'use strict'

import m from 'mithril'

import TopAppBar from './Material/TopAppBar'
import Typography from './Material/Typography'
import Icon from './Material/Icon'

import MemberSearch from './MemberSearch'
import store from '../store'
import windowSize from '../lib/windowsize'
import stylish from '../lib/stylish'
import classify from '../lib/classify'
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

export default {
  view ({ attrs: { onNav, includeSearch } }) {
    return classify(
      stylish(style),
      <TopAppBar fixed onNav={onNav}>
        <TopAppBar.Row>
          <TopAppBar.Section alignStart>
            <TopAppBar.Icon navigation>menu</TopAppBar.Icon>

            <Typography
              className='title'
              headline5
              xattrs={{ onclick: store.members.fetchAll }}
            >
              {windowSize.isSmall ? 'LCS' : 'Ludlow Civic Society'}
            </Typography>

            {config.isTest && (
              <Typography className='test' body1>
                (test)
              </Typography>
            )}

            <EngineStatus className='engine-status' />
          </TopAppBar.Section>

          {includeSearch && <MemberSearch />}
        </TopAppBar.Row>
      </TopAppBar>
    )
  }
}

function EngineStatus () {
  const states = {
    idle: [],
    busy: ['sync'],
    disconnected: ['cloud_off'],
    error: ['error', '/error']
  }

  return {
    view ({ attrs }) {
      const status = store.engine.getStatus()
      let [icon, target] = states[status]
      if (!icon) return false
      icon = <Icon {...attrs}>{icon}</Icon>
      if (!target) return icon
      return (
        <a href={target} oncreate={m.route.link}>
          {icon}
        </a>
      )
    }
  }
}
