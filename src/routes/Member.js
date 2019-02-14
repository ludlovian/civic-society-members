'use strict'

import { el, vw, classify } from '../domvm'
import { Card, Typography, TabBar } from '../components/Material'
import MemberDetails from '../components/MemberDetails'
import MemberFiles from '../components/MemberFiles'
import MemberPayments from '../components/MemberPayments'
import stylish from '../lib/stylish'
import stream from '../lib/stream'
import defer from '../lib/defer'
import { views, actions } from '../store'

const TABS = 'Details Payments Files'.split(' ')

function tabFromRoute ({ data: { tab } = {} } = {}) {
  tab = tab || TABS[0]
  if (!TABS.find(t => t.toLowerCase() === tab.toLowerCase())) {
    tab = TABS[0]
  }
  return tab.toLowerCase()
}

export default function Member (vm) {
  const style = `
    :self.scrim { padding: 12px; }
    .card { margin: auto; padding: 16px; max-width: 800px; }
  `

  // ensure files are fetched
  defer(actions.members.fetchFiles)

  const tab = views.route.state.map(tabFromRoute)
  const monitor = stream.combine(
    () => vm.redraw(),
    [views.members.members, views.route.state],
    { skip: true }
  )

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
      return classify(
        stylish(style),
        el('.scrim', member ? MemberCard({ member, tab }) : NoMemberCard())
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
  files: MemberFiles
}

const SelectedTab = ({ tab, member }) => vw(tabViews[tab()], { member })
