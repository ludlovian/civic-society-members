'use strict'

import { el } from '../domvm'
import { Typography } from 'domvm-material'
import dayjs from 'dayjs'
// advancedFormat extension already loaded by MemberFiles
import stylish from 'stylish'
import sortBy from '../lib/sortBy'
import { views } from '../store'
import { formatters } from '../lib/forms'

export default function MemberHistory (vm) {
  const style = stylish`
    .:self { padding: 24px; }
    .history-date { padding-top: 10px; }
    .history-detail { padding-left: 24px; }
  `
  const monitor = views.route.state.merge(views.members.members)
  monitor.subscribe(() => vm.redraw())

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render (vm, { member }) {
      const txns = member.history
        .slice()
        .sort(sortBy(txn => txn.date))
        .reverse()
      return el(
        'div',
        { class: style },
        txns.length ? HistoryList({ txns }) : NoHistory()
      )
    }
  }
}

const NoHistory = () =>
  Typography.Body1(
    { class: 'no-history' },
    'No history recorded for this member'
  )

const HistoryList = ({ txns }) =>
  [].concat(
    ...txns.map(txn => [
      el(
        'div',
        { class: 'history-date' },
        Typography.Body1(dayjs(txn.date).format('Do MMM YYYY HH:mm:ss ')),
        Typography.Body2(el('i', '(' + txn.user + ')'))
      ),
      el(
        'div',
        { class: 'history-detail' },
        txn.member ? MemberTxn(txn.member) : PaymentTxn(txn.payment)
      )
    ])
  )

const MemberTxn = change =>
  breakLines(
    Object.keys(change)
      .filter(k => k !== 'id')
      .map(k =>
        Typography.Body2(`${k} ⇒ ${String(change[k]).replace(/\n/g, '↵')}`)
      )
  )
const PaymentTxn = pmt =>
  Typography.Body2(
    `Payment of ${formatters.currency(pmt.amount)} on ${dayjs(pmt.date).format(
      'Do MMM'
    )} via ${pmt.method}`
  )

function breakLines (lines) {
  return Array.prototype.concat.apply(
    [],
    lines.map((line, i) => (i === 0 ? line : [el('br'), line]))
  )
}
