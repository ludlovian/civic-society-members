'use strict'

import { el, vw } from '../domvm'
import { LayoutGrid, Card, Typography, Icon } from 'domvm-material'
import stylish from 'stylish'
import teme from 'teme'
import { views, actions } from '../store'
import MediaQuery from '../components/MediaQuery'
import * as Member from '../store/member'
import sortBy from '../lib/sortBy'

export default function MemberList (vm) {
  const style = stylish`
    .card { max-width: 400px; padding: 8px; min-height: 200px; }
    .card .header { padding-bottom: 8px }
    .card .body { flex-grow: 1; }
    .card .rhs { float: right; text-align: right; }
    .card .address { font-size: 12px; }
    .card .contact { font-size: 12px; }
    .card .icon { color: rgb(0,0,0,0.5); }
    .no-match { padding: 20px; }
    .loading { padding: 20px; }
  `
  const monitor = teme.merge(
    views.members.members,
    views.auth.signedIn,
    views.route.state
  )
  monitor.subscribe(() => vm.redraw())

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render () {
      const { filter } = views.route.state().data || {}
      const members = Object.values(views.members.members())
        .filter(m => !filter || Member.searchText(m).indexOf(filter) !== -1)
        .filter(m => !!m.sortName)
        .sort(sortBy(m => m.sortName))
      const loaded = views.members.loaded()

      return el(
        '.scrim',
        { class: style },
        !loaded ? Loading() : Null(),
        loaded && !members.length ? NoMembers() : Null(),
        loaded && !!members.length ? Members({ members }) : Null()
      )
    }
  }
}

const Members = ({ members }) =>
  vw(MediaQuery, {
    match: '(min-width:1250px)',
    render: isLarge => MemberCards({ members, cols: isLarge ? 3 : 4 })
  })

const Null = () => el('div')

const Loading = () => el('.loading', Typography.Headline6('Loading...'))

const NoMembers = () =>
  el('.no-match', Typography.Body1('There are no members that match'))

const MemberCards = ({ members, cols }) =>
  LayoutGrid(
    members.map(member => MemberCard({ key: member.id, member, cols }))
  )

const MemberCard = ({ member, cols }) =>
  LayoutGrid.Cell(
    { cols },
    Card(
      { class: 'card' },
      CardHeader({ member }),
      el('.body', IconsAndContact({ member }), Address({ member })),
      Card.Actions(
        { class: 'actions' },
        Card.ActionIcons(
          Card.ActionIcon(
            { href: `/member/${member.id}`, onclick: [toMember, member] },
            'more_horiz'
          )
        )
      )
    )
  )

function toMember (member) {
  actions.route.toPage('member', { id: member.id })
  return false
}

const CardHeader = ({ member }) =>
  el('.header', Typography.Headline6(member.sortName))

const IconsAndContact = ({ member }) => {
  let icons = [
    Member.isLife(member) && 'favorite_border',
    Member.isJoint(member) && 'people',
    Member.isCorporate(member) && 'business_center'
  ].filter(Boolean)
  icons = icons.map(n => Icon({ class: 'icon' }, n))

  let lines = breakLines(
    [
      icons.length && icons,
      member.tel && Typography.Body2({ class: 'contact' }, member.tel),
      member.email &&
        el(
          'a',
          { href: 'mailto:' + member.email },
          Icon({ class: 'icon' }, 'email')
        )
    ].filter(Boolean)
  )
  lines = [].concat(...lines)

  return el('span.rhs', lines)
}

const Address = ({ member }) => {
  const lines = breakLines(member.address.split('\n'))
  return Typography.Body2({ class: 'address' }, lines)
}

function breakLines (lines) {
  return Array.prototype.concat.apply(
    [],
    lines.map((line, i) => (i === 0 ? line : [el('br'), line]))
  )
}
