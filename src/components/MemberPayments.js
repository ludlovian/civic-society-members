'use strict'

import m from 'mithril'

import Typography from './Material/Typography'
import Card from '../components/Material/Card'
import Button from '../components/Material/Button'

import store from '../store'
import dayjs from 'dayjs'
import classify from '../lib/classify'
import stylish from '../lib/stylish'
import sortBy from '../lib/sortBy'
import pdsp from '../lib/pdsp'
import { getRoute, setRoute } from '../lib/routeutil'

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

  let form
  let member
  let lastPayment

  function onedit (e) {
    pdsp(e)
    form = getForm(lastPayment)
    const route = getRoute()
    route.query.add = ''
    setRoute(route)
  }

  function oncancel (e) {
    pdsp(e)
    const route = getRoute()
    delete route.query.add
    setRoute(route)
  }

  async function onsave (e) {
    pdsp(e)
    await form.validate()
    if (form.hasError) return null
    store.members.addPayment(member, form.getValues())
    const route = getRoute()
    delete route.query.add
    setRoute(route)
  }

  return {
    view ({ attrs }) {
      member = attrs.member
      const route = getRoute()
      const isAdding = 'add' in route.query
      const payments = member.payments.slice().sort(sortBy(pmt => pmt.date))

      // stash the last payment away each time, so we can use
      // it as a template for the form
      lastPayment = payments.slice().pop()

      return classify(
        stylish(style),
        <div>
          <table>
            <thead>
              <tr>
                {'Date|Amount|Paid by'.split('|').map(t => (
                  <Typography headline6>{t}></Typography>
                ))}
              </tr>
            </thead>

            <tbody>
              {!payments.length && (
                <tr>
                  <td colspan='3'>
                    <Typography body1>No payments recorded</Typography>
                  </td>
                </tr>
              )}

              {payments.map(pmt => (
                <tr className='payment'>
                  <td>
                    <Typography body1>
                      {dayjs(pmt.date).format('Do MMM YY')}
                    </Typography>
                  </td>

                  <td>
                    <Typography body1>
                      {formatters.currency(pmt.amount)}
                    </Typography>
                  </td>

                  <td>
                    <Typography body1>{pmt.method}</Typography>
                  </td>
                </tr>
              ))}

              {isAdding && <NewPayment form={form} />}
            </tbody>
          </table>

          <Card.Actions className='buttons'>
            {isAdding && (
              <Button key='cancel' ripple xattrs={{ onclick: oncancel }}>
                Cancel
              </Button>
            )}

            <Button
              key='add'
              ripple
              raised={isAdding}
              xattrs={{ onclick: isAdding ? onsave : onedit }}
            >
              Add
            </Button>
          </Card.Actions>
        </div>
      )
    }
  }
}

const NewPayment = {
  view ({ attrs: { form } }) {
    return (
      <tr className='new-payment'>
        <td>
          <Field label='Date' type='date' fieldState={form.$.date} />
        </td>

        <td>
          <Field label='Amount' fieldState={form.$.amount} />
        </td>

        <td>
          <Field label='Paid by' fieldState={form.$.method} />
        </td>
      </tr>
    )
  }
}

function getForm (pmt) {
  return new FormState({
    date: new FieldState(
      dayjs()
        .startOf('day')
        .toDate()
    )
      .validators(validators.required)
      .parser(parsers.date)
      .formatter(formatters.date),

    amount: new FieldState(pmt ? pmt.amount : '')
      .validators(validators.required, validators.currency)
      .parser(parsers.currency)
      .formatter(formatters.currency),

    method: new FieldState(pmt ? pmt.method : '')
  })
}
