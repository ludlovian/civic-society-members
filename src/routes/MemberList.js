'use strict'

import h from '../lib/hyperscript'

import LayoutGrid from '../components/Material/LayoutGrid'
import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'
import Icon from '../components/Material/Icon'

import classnames from 'classnames'
import stylish from '../lib/stylish'
import stream from '../lib/stream'
import { views, actions } from '../store'
import MediaQuery from '../components/MediaQuery'
import * as Member from '../store/member'
import breakLines from '../lib/breakLines'
import sortBy from '../lib/sortBy'

export default function MemberList (vm) {
  const style = `
    .card { max-width: 400px; padding: 8px; min-height: 200px; }
    .card .header { padding-bottom: 8px }
    .card .body { flex-grow: 1; }
    .card .rhs { float: right; text-align: right; }
    .card .address { font-size: 12px; }
    .card .contact { font-size: 12px; }
    .no-match { padding: 20px; }
    .loading { padding: 20px; }
  `
  const monitor = stream.combine(() => vm.redraw(), [
    views.members.members,
    views.auth.signedIn,
    views.route.state
  ])

  return {
    hooks: {
      willUnmount () {
        monitor.end(true)
      }
    },

    render () {
      const { filter } = views.route.state().data || {}
      const members = Object.values(views.members.members())
        .filter(m => !filter || Member.searchText(m).indexOf(filter) !== -1)
        .filter(m => !!m.sortName)
        .sort(sortBy(m => m.sortName))
      const loaded = views.members.loaded()

      const cl = classnames(stylish(style), 'scrim')
      return (
        <div class={cl}>
          {!loaded ? <Loading /> : <Null />}
          {loaded && !members.length ? <NoMembers /> : <Null />}
          {loaded && !!members.length ? (
            <MediaQuery match='(min-width:1250px)'>
              {isLarge => (
                <MemberCards members={members} cols={isLarge ? 3 : 4} />
              )}
            </MediaQuery>
          ) : (
            <Null />
          )}
        </div>
      )
    }
  }
}

const Null = { template: () => <div /> }

const Loading = {
  template: () => (
    <div class='loading'>
      <Typography headline6>Loading...</Typography>
    </div>
  )
}

const NoMembers = {
  template: () => (
    <div class='no-match'>
      <Typography body1>There are no members that match</Typography>
    </div>
  )
}

const MemberCards = {
  template: ({ members, cols }) => (
    <LayoutGrid>
      {members.map(member => (
        <MemberCard key={member.id} member={member} cols={cols} />
      ))}
    </LayoutGrid>
  )
}

const MemberCard = {
  template ({ member, cols }) {
    return (
      <LayoutGrid.Cell cols={cols}>
        <Card class='card'>
          <CardHeader member={member} />
          <div class='body'>
            <IconsAndContact member={member} />
            <Address member={member} />
          </div>
          <Card.Actions class='actions'>
            <Card.ActionIcons>
              <Card.ActionIcon
                href={`/member/${member.id}`}
                onclick={[toMember, member]}
              >
                more_horiz
              </Card.ActionIcon>
            </Card.ActionIcons>
          </Card.Actions>
        </Card>
      </LayoutGrid.Cell>
    )
  }
}

function toMember (member) {
  actions.route.toPage('member', { id: member.id })
  return false
}

const CardHeader = {
  template: ({ member }) => (
    <div class='header'>
      <Typography headline6>{member.sortName}</Typography>
    </div>
  )
}

const IconsAndContact = {
  template ({ member }) {
    const icons = [
      Member.isLife(member) && 'favorite_border',
      Member.isJoint(member) && 'people',
      Member.isCorporate(member) && 'business_center'
    ]
      .filter(Boolean)
      .map(n => <Icon>{n}</Icon>)

    let lines = breakLines(
      [
        icons,
        member.tel && (
          <Typography body2 class='contact'>
            {member.tel}
          </Typography>
        )
      ].filter(Boolean)
    )
    lines = [].concat(...lines)

    return <span class='rhs'>{lines}</span>
  }
}

const Address = {
  template: ({ member }) => {
    const lines = breakLines(member.address.split('\n'))
    const ret = (
      <Typography body2 class='address'>
        {lines}
      </Typography>
    )
    return ret
  }
}
