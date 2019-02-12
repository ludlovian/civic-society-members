'use strict'

import h from '../lib/hyperscript'

import Typography from './Material/Typography'
import Card from '../components/Material/Card'
import Button from '../components/Material/Button'

import { views, actions } from '../store'
import dayjs from 'dayjs'
import stylish from '../lib/stylish'
import sortBy from '../lib/sortBy'

import Field from './Field'
import {
  FormState,
  FieldState,
  validators,
  formatters,
  parsers
} from '../lib/formstate'

export default function MemberPayments () {
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

  let cleanup = []
  let form

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
    init (vm, { member }) {
      form = getForm(getPayments(member).pop())
    },
    hooks: {
      didMount (vm, { member }) {
        cleanup = [
          views.route.state.on(() => vm.redraw()),
          views.members.members.on(() => vm.redraw())
        ]
      },
      willUnmount () {
        cleanup.forEach(f => f())
      }
    },

    render (vm, { member }) {
      const { edit } = views.route.state().data
      const payments = getPayments(member)
      const cl = stylish(style)

      return (
        <div class={cl}>
          <table>
            <Heading />
            <tbody>
              {payments.length ? (
                <PaymentRows payments={payments} />
              ) : (
                <NoPayments />
              )}
              {edit && <NewPayment form={form} />}
            </tbody>
          </table>

          <Card.Actions class='buttons'>
            {edit && (
              <Button id='cancel' key='cancel' ripple onclick={[oncancel]}>
                Cancel
              </Button>
            )}

            <Button
              id='edit'
              key='edit'
              ripple
              raised={edit}
              onclick={[edit ? onsave : onedit, member]}
            >
              Add
            </Button>
          </Card.Actions>
        </div>
      )
    }
  }
}

const Heading = {
  template: () => (
    <thead>
      <tr>
        {'Date|Amount|Paid by'.split('|').map(t => (
          <th _key={t}>
            <Typography headline6>{t}</Typography>
          </th>
        ))}
      </tr>
    </thead>
  )
}

const NoPayments = {
  template: () => (
    <tr>
      <td colspan='3'>
        <Typography body1>No payments recorded</Typography>
      </td>
    </tr>
  )
}

const PaymentRows = {
  template: ({ payments }) =>
    payments.map(pmt => (
      <tr class='payment'>
        <td>
          <Typography body1>{dayjs(pmt.date).format('Do MMM YY')}</Typography>
        </td>

        <td>
          <Typography body1>{formatters.currency(pmt.amount)}</Typography>
        </td>

        <td>
          <Typography body1>{pmt.method}</Typography>
        </td>
      </tr>
    ))
}

const NewPayment = {
  template: ({ form }) => (
    <tr class='new-payment'>
      <td>
        <Field label='Date' id='date' type='date' fieldState={form.$.date} />
      </td>

      <td>
        <Field label='Amount' id='amount' fieldState={form.$.amount} />
      </td>

      <td>
        <Field label='Paid by' id='method' fieldState={form.$.method} />
      </td>
    </tr>
  )
}

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
