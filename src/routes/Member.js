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

// const MemberDetails = { view: () => m(Typography.Headline6, 'Details') }

export default
function Member () {
  const style = `
    :self.scrim { padding: 12px; }
    .card { margin: auto; padding: 16px; max-width: 800px; }
  `

  return {
    oninit ({ attrs: { id } }) {
      if (id === 'new') {
        const member = store.members.getNewMember()
        m.route.set(`/member/${member.id}`, null, { replace: true })
      }
    },

    oncreate () {
      store.members.ensureFilesLoaded()
    },

    view ({ attrs: { id } }) {
      const member = store.members.getMember(id)

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
