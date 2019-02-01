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
      m(TopAppBar, { fixed: true, onNav },
        m(TopAppBar.Row,
          m(TopAppBar.Section, { alignStart: true },
            m(TopAppBar.Icon, { navigation: true }, 'menu'),

            classify(
              'title',
              m(Typography.Headline5,
                { xattrs: { onclick: store.members.fetchAll } },
                windowSize.isSmall ? 'LCS' : 'Ludlow Civic Society'
              )
            ),

            config.isTest && classify(
              'test',
              m(Typography.Body1, '(test)')
            ),

            classify(
              'engine-status',
              m(EngineStatus)
            )
          ),

          includeSearch && m(MemberSearch)
        )
      )
    )
  }
}

function EngineStatus () {
  const states = {
    idle: [],
    busy: [ 'sync' ],
    disconnected: [ 'cloud_off' ],
    error: [ 'error', '/error' ]
  }

  return {
    view ({ attrs }) {
      const status = store.engine.getStatus()
      let [ icon, target ] = states[status]
      if (!icon) return false
      icon = m(Icon, attrs, icon)
      if (!target) return icon
      return m('a', { href: target, oncreate: m.route.link }, icon)
    }
  }
}
