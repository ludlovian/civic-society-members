'use strict'

import { vw, el, classify } from '../domvm'
import { Button, Card, Typography } from './Material'
import { views, actions } from '../store'
import dayjs from 'dayjs'
import stylish from '../lib/stylish'
import stream from '../lib/stream'
import sortBy from '../lib/sortBy'
import Field from './Field'
import {
  FormState,
  FieldState,
  validators,
  formatters,
  parsers
} from '../lib/formstate'

export default function MemberPayments (vm, { member }) {
  const style = `
    :self { padding: 16px }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left;
      border-bottom: solid 1px;
    }

    td { padding-top: 12px; }
    tbody > tr:first-child > td { padding-top: 24px; }
    tr.new-payment > td { padding-top: 24px }

    .buttons { justify-content: flex-end; }
    .buttons>.mdc-button { margin-left: 12px; }
  `

  const monitor = stream.combine(
    () => vm.redraw(),
    [views.route.state, views.members.members],
    { skip: true }
  )
  const form = getForm(getPayments(member).pop())

  function onedit (member) {
    actions.route.updateData({ edit: true })
    return false
  }

  function oncancel () {
    actions.route.updateData({ edit: false })
    return false
  }

  function onsave (member) {
    form.validate().then(isValid => {
      if (!isValid) return
      actions.members.addPayment(member, form.getValues())
      actions.route.updateData({ edit: false })
    })
    return false
  }

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render (vm, { member }) {
      const { edit } = views.route.state().data
      const payments = getPayments(member)
      return classify(
        stylish(style),
        el(
          'div',
          el(
            'table',
            Heading(),
            el(
              'tbody',
              payments.length ? PaymentRows({ payments }) : NoPayments(),
              edit && NewPayment({ form })
            )
          ),
          Card.Actions(
            { class: 'buttons' },
            edit &&
              Button(
                {
                  id: 'cancel',
                  _key: 'cancel',
                  ripple: true,
                  onclick: [oncancel]
                },
                'Cancel'
              ),
            Button(
              {
                id: 'edit',
                _key: 'edit',
                ripple: true,
                raised: edit,
                onclick: [edit ? onsave : onedit, member]
              },
              'Add'
            )
          )
        )
      )
    }
  }
}

const Heading = () =>
  el(
    'thead',
    el(
      'tr',
      'Date|Amount|Paid by'
        .split('|')
        .map(t => el('th', { _key: t }, Typography.Headline6(t)))
    )
  )

const NoPayments = () =>
  el('tr', el('td[colspan=3]', Typography.Body1('No payments recorded')))

const PaymentRows = ({ payments }) =>
  payments.map(pmt =>
    el(
      'tr.payment',
      el('td', Typography.Body1(dayjs(pmt.date).format('Do MMM YY'))),
      el('td', Typography.Body1(formatters.currency(pmt.amount))),
      el('td', Typography.Body1(pmt.method))
    )
  )

const NewPayment = ({ form }) =>
  el(
    'tr.new-payment',
    el('td', [
      vw(Field, {
        label: 'Date',
        id: 'date',
        type: 'date',
        fieldState: form.$.date
      })
    ]),
    el('td', [
      vw(Field, { label: 'Amount', id: 'amount', fieldState: form.$.amount })
    ]),
    el('td', [
      vw(Field, { label: 'Paid by', id: 'method', fieldState: form.$.method })
    ])
  )

function getForm (pmt) {
  return new FormState({
    date: new FieldState({
      value: dayjs()
        .startOf('day')
        .toDate(),
      validator: validators.required,
      parser: parsers.date,
      formatter: formatters.date
    }),
    amount: new FieldState({
      value: pmt ? pmt.amount : '',
      validator: [validators.required, validators.currency],
      parser: parsers.currency,
      formatter: formatters.currency
    }),
    method: new FieldState({
      value: pmt ? pmt.method : ''
    })
  })
}

function getPayments (member) {
  return member.payments.slice().sort(sortBy(pmt => pmt.date))
}
