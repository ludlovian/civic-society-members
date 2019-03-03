'use strict'

import { el, vw } from '../domvm'
import { Card, Typography, TabBar } from 'domvm-material'
import MemberDetails from '../components/MemberDetails'
import MemberFiles from '../components/MemberFiles'
import MemberPayments from '../components/MemberPayments'
import MemberHistory from '../components/MemberHistory'
import stylish from 'stylish'
import teme from 'teme'
import defer from '../lib/defer'
import { views, actions } from '../store'

const TABS = 'Details Payments Files History'.split(' ')

function tabFromRoute ({ data: { tab } = {} } = {}) {
  tab = tab || TABS[0]
  if (!TABS.find(t => t.toLowerCase() === tab.toLowerCase())) {
    tab = TABS[0]
  }
  return tab.toLowerCase()
}

export default function Member (vm) {
  const style = stylish`
    .:self.scrim { padding: 12px; }
    .card { margin: auto; padding: 16px; max-width: 800px; }
  `

  // ensure files are fetched
  defer(actions.members.fetchFiles)

  const tab = views.route.state.map(tabFromRoute)
  const monitor = teme.merge(views.members.members, views.route.state)
  monitor.subscribe(() => vm.redraw())

  return {
    hooks: {
      willUnmount () {
        monitor.end(true)
        tab.end(true)
      }
    },

    render (vm) {
      const id = views.route.state().data.id
      const member = views.members.member(id)
      return el(
        '.scrim',
        { class: style },
        member ? MemberCard({ member, tab }) : NoMemberCard()
      )
    }
  }
}

const NoMemberCard = () =>
  Card({ class: 'card' }, Typography.Headline6('No such member exists'))

const MemberCard = ({ tab, member }) =>
  Card(
    { class: 'card', _key: member.id },
    MemberTitle({ member }),
    MemberTabs({ tab, member }),
    SelectedTab({ tab, member })
  )

const MemberTitle = ({ member }) =>
  el('.header', Typography.Headline6(`${member.id}: ${member.sortName}`))

const MemberTabs = ({ tab, member }) => {
  function onchange (e) {
    const tab = TABS[e.detail.index].toLowerCase()
    actions.route.updateData({ tab, edit: false })
  }
  return TabBar(
    { onchange },
    TABS.map(t =>
      TabBar.Tab({ active: t.toLowerCase() === tab() }, TabBar.TabText(t))
    )
  )
}

const tabViews = {
  details: MemberDetails,
  payments: MemberPayments,
  files: MemberFiles,
  history: MemberHistory
}

const SelectedTab = ({ tab, member }) => vw(tabViews[tab()], { member })
