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
import windowSize from '../lib/windowsize'

export default function MemberList () {
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
        .filter(m => !filter || Member.searchText(m).indexOf(filter) !== -1)
        .filter(m => !!m.sortName)
        .sort(sortBy(m => m.sortName))

      return classify(
        stylish(style),
        <div className='scrim'>
          {!loaded && (
            <div className='loading'>
              <Typography headline6>Loading...</Typography>
            </div>
          )}

          {loaded && !members.length && (
            <div className='no-match'>
              <Typography body1>There are no members that match</Typography>
            </div>
          )}

          {members.length && (
            <LayoutGrid>
              {members.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </LayoutGrid>
          )}
        </div>
      )
    }
  }
}

const MemberCard = {
  view ({ attrs: { member } }) {
    const cols = windowSize.isExtraLarge ? 3 : 4
    return (
      <LayoutGrid.Cell cols={cols}>
        <Card className='card'>
          <div className='header'>
            <Typography headline6>{member.sortName}</Typography>
          </div>

          <div className='body'>
            <span className='rhs'>
              {breakLines(
                [
                  [
                    Member.isLife(member) && 'favorite_border',
                    Member.isJoint(member) && 'people',
                    Member.isCorporate(member) && 'business_center'
                  ]
                    .filter(Boolean)
                    .map(n => <Icon>{n}</Icon>),

                  member.tel && (
                    <Typography body2 className='contact'>
                      {member.tel}
                    </Typography>
                  )
                ].filter(Boolean)
              )}
            </span>

            <Typography body2 className='address'>
              {breakLines(member.address.split('\n'))}
            </Typography>
          </div>

          <Card.Actions className='actions'>
            <Card.ActionIcons>
              <Card.ActionIcon
                href={`/member/${member.id}`}
                xattrs={{ oncreate: m.route.link }}
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
