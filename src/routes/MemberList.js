'use strict'

import m from 'mithril'

import LayoutGrid from '../components/Material/LayoutGrid'
import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'
import Icon from '../components/Material/Icon'

import classify from '../lib/classify'
import stylish from '../lib/stylish'
import store from '../store'
import * as Member from '../store/member'
import breakLines from '../lib/breakLines'
import sortBy from '../lib/sortBy'
import { getRoute } from '../lib/routeutil'

export default
function MemberList () {
  const style = `
    .card { max-width: 400px; padding: 8px; min-height: 200px; }
    .card .header { padding-bottom: 8px }
    .card .rhs { float: right; text-align: right; }
    .card .address { font-size: 12px; }
    .card .contact { font-size: 12px; }
    .card .actions { padding: 0; min-height: 0; }
    .no-match { padding: 20px; }
    .loading { padding: 20px; }
  `
  return {
    view () {
      const route = getRoute()
      const filter = (route.query.q || '').toLowerCase()
      const loaded = store.members.isLoaded()

      const members = Object.values(store.members.members())
        .filter(m => (!filter || Member.searchText(m).indexOf(filter) !== -1))
        .filter(m => !!m.sortName)
        .sort(sortBy(m => m.sortName))

      return classify(
        stylish(style),
        'scrim',
        m('div',
          !loaded && m('div.loading',
            m(Typography.Headline6, 'Loading...')),

          loaded && !members.length && m('div.no-match',
            m(Typography.Body1, 'There are no members that match')
          ),

          loaded && members.length && m(LayoutGrid,
            members.map(member =>
              m(MemberCard, { member, key: member.id })
            )
          )
        )
      )
    }
  }
}

const MemberCard = {
  view ({ attrs: { member } }) {
    return m(LayoutGrid.Cell,
      { cols: 4 },
      m(Card, { className: 'card' },
        m('div.header',
          m(Typography.Headline6, member.sortName)
        ),

        m('div.body',
          m('span.rhs',
            breakLines([
              [
                Member.isLife(member) && 'favorite_border',
                Member.isJoint(member) && 'people',
                Member.isCorporate(member) && 'business_center'
              ].filter(Boolean)
                .map(n => m(Icon, n)),

              member.tel && m(Typography.Body2,
                { className: 'contact' },
                member.tel
              )
            ].filter(Boolean))
          ),

          m(Typography.Body2,
            { className: 'address' },
            breakLines(
              member.address.split('\n')
            )
          )
        ),

        m(Card.Actions,
          { className: 'actions' },
          m(Card.ActionIcons,
            m(Card.ActionIcon,
              {
                href: `/member/${member.id}`,
                xattrs: { oncreate: m.route.link }
              },
              'more_horiz'
            )
          )
        )
      )
    )
  }
}
