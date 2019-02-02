'use strict'

import m from 'mithril'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'
import TabBar from '../components/Material/TabBar'

import MemberDetails from '../components/MemberDetails'
import MemberFiles from '../components/MemberFiles'
import MemberPayments from '../components/MemberPayments'

import store from '../store'
import stylish from '../lib/stylish'
import classify from '../lib/classify'
import { getRoute, setRoute } from '../lib/routeutil'

// const MemberDetails = { view: () => m(Typography.Headline6, 'Details') }

const TABS = 'Details Payments Files'.split(' ')

export default
function Member () {
  const style = `
    :self.scrim { padding: 12px; }
    .card { margin: auto; padding: 16px; max-width: 800px; }
  `

  return {
    oncreate () {
      store.members.ensureFilesLoaded()
    },

    view ({ attrs: { id } }) {
      if (id === 'new') {
        const member = store.members.getNewMember()
        setRoute(
          {
            path: '/member/' + member.id,
            query: { tab: 'details', edit: '' }
          },
          { replace: true }
        )
        return false
      }

      const member = store.members.getMember(id)
      const route = getRoute()
      const tab = TABS.find(t => t.toLowerCase() === route.query.tab) || TABS[0]

      function ontabchange (tab) {
        const route = getRoute()
        route.query.tab = tab.toLowerCase()
        setRoute(route)
      }

      return classify(
        stylish(style),
        'scrim',
        m('div',
          m(Card, { className: 'card' },
            !member && m(Typography.Headline6,
              'No such member exists'
            ),

            member && [
              m('div.header',
                m(Typography.Headline6,
                  `${member.id}: ${member.sortName}`
                )
              ),

              m(TabBar.AutoTab,
                { tab, ontabchange },
                m(MemberDetails, { member, tab: 'Details' }),
                m(MemberPayments, { member, tab: 'Payments' }),
                m(MemberFiles, { member, tab: 'Files' })
              )
            ]
          )
        )
      )
    }
  }
}
