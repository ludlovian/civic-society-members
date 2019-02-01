'use strict'

import m from 'mithril'

import Typography from './Material/Typography'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import classify from '../lib/classify'
import stylish from '../lib/stylish'
import sortBy from '../lib/sortBy'

dayjs.extend(advancedFormat)

export default
function MemberFiles () {
  const style = `
    :self { padding: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; border-bottom: solid 2px; }
    td { padding-top: 10px }
    tbody > tr:first-child > td { padding-top: 20px; }
  `

  return {
    view ({ attrs: { member } }) {
      const files = member.files.slice()
        .sort(sortBy(f => f.date))

      return classify(
        stylish(style),
        m('div',
          m('table',
            m('thead',
              m('tr',
                'Date,File'.split(',').map(t =>
                  m('th', m(Typography.Headline6, t))
                )
              )
            ),

            m('tbody',
              !files.length && m('tr',
                m('td',
                  { colspan: 2 },
                  m(Typography.Body1,
                    'No files recorded for this member'
                  )
                )
              ),

              files.map(f =>
                m('tr',
                  m('td',
                    m(Typography.Body1,
                      dayjs(f.date).format('Do MMM YY')
                    )
                  ),

                  m('td',
                    m('a',
                      { href: f.link },
                      m(Typography.Body1,
                        f.type
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    }
  }
}
