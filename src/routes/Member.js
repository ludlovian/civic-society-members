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

const TABS = 'Details Payments Files'.split(' ')

export default function Member () {
  const style = `
    :self.scrim { padding: 12px; }
    .card { margin: auto; padding: 16px; max-width: 800px; }
  `

  return {
    oncreate () {
      store.members.ensureFilesLoaded()
    },

    view ({ attrs: { key } }) {
      const id = key
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
        <div className='scrim'>
          <Card className='card'>
            {!member && (
              <Typography headline6>No such member exists</Typography>
            )}

            {member && [
              <div className='header'>
                <Typography headline6>
                  {`${member.id}: ${member.sortName}`}
                </Typography>
              </div>,

              <TabBar.AutoTab tab={tab} ontabchange={ontabchange}>
                <MemberDetails tab='Details' key={member.id} member={member} />
                <MemberPayments tab='Payments' key={member.id} member={member} />
                <MemberFiles tab='Files' key={member.id} member={member} />
              </TabBar.AutoTab>
            ]}
          </Card>
        </div>
      )
    }
  }
}
