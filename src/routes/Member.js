'use strict'

import h from '../lib/hyperscript'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'
import TabBar from '../components/Material/TabBar'

import MemberDetails from '../components/MemberDetails'
import MemberFiles from '../components/MemberFiles'
import MemberPayments from '../components/MemberPayments'

import stylish from '../lib/stylish'
import defer from '../lib/defer'
import classnames from 'classnames'
import { views, actions } from '../store'

// const MemberPayments = { render: () => <h1>MemberPayments</h1> }

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
  let cleanup = []

  return {
    hooks: {
      didMount (vm) {
        // redraw on change of route or members
        cleanup = [
          views.members.members.on(() => vm.redraw()),
          views.route.state.on(() => vm.redraw())
        ]
      },
      willUnmount () {
        cleanup.forEach(f => f())
        tab.end(true)
      }
    },

    render (vm) {
      const id = views.route.state().data.id
      const member = views.members.member(id)
      const cl = classnames(stylish(style), 'scrim')
      return (
        <div class={cl}>
          {member ? <MemberCard member={member} tab={tab} /> : <NoMemberCard />}
        </div>
      )
    }
  }
}

const NoMemberCard = {
  template: () => (
    <Card class='card'>
      <Typography headline6>No such member exists</Typography>
    </Card>
  )
}

const MemberCard = {
  template: ({ tab, member }) => (
    <Card class='card'>
      <MemberTitle member={member} />
      <MemberTabs tab={tab} member={member} />
      <SelectedTab tab={tab} member={member} />
    </Card>
  )
}

const MemberTitle = {
  template: ({ member }) => (
    <div class='header'>
      <Typography headline6>{`${member.id}: ${member.sortName}`}</Typography>
    </div>
  )
}

const MemberTabs = {
  template ({ tab, member }) {
    function onchange (e) {
      const tab = TABS[e.detail.index].toLowerCase()
      actions.route.updateData({ tab, edit: false })
    }
    return (
      // tabs are keyed to ensure ditched on new member to reset the tab position
      <TabBar onchange={onchange} key={member.id}>
        {TABS.map(t => (
          <TabBar.Tab active={t.toLowerCase() === tab()}>
            <TabBar.TabText>{t}</TabBar.TabText>
          </TabBar.Tab>
        ))}
      </TabBar>
    )
  }
}

const SelectedTab = {
  template ({ tab, member }) {
    switch (tab()) {
      case 'details':
        return <MemberDetails member={member} />
      case 'payments':
        return <MemberPayments member={member} />
      case 'files':
        return <MemberFiles member={member} />
    }
  }
}
