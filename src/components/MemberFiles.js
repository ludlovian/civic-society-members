'use strict'

import { el, classify } from '../domvm'
import { Typography } from './Material'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import stylish from '../lib/stylish'
import sortBy from '../lib/sortBy'

dayjs.extend(advancedFormat)

export default function MemberFiles () {
  const style = `
    :self { padding: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; border-bottom: solid 2px; }
    td { padding-top: 10px }
    tbody > tr:first-child > td { padding-top: 20px; }
  `

  return {
    render (vm, { member }) {
      const files = member.files.slice().sort(sortBy(f => f.date))
      return classify(
        stylish(style),
        el(
          'div',
          el(
            'table',
            TableHead(),
            el('tbody', files.length ? FilesList({ files }) : NoFiles())
          )
        )
      )
    }
  }
}

const NoFiles = () =>
  el(
    'tr',
    el(
      'td',
      { colspan: 2 },
      Typography.Body1('No files recorded for this member')
    )
  )

const FilesList = ({ files }) =>
  files.map(f =>
    el(
      'tr',
      el('td', Typography.Body1(dayjs(f.date).format('Do MMM YY'))),
      el('td', el('a', { href: f.link }, Typography.Body1(f.type)))
    )
  )

const TableHead = () =>
  el(
    'thead',
    el('tr', 'Date,File'.split(',').map(t => el('th', Typography.Headline6(t))))
  )
