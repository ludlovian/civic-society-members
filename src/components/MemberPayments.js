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
import valoo from '../lib/valoo'

import Field from './Field'
import { FormState, FieldState, validators, formatters, parsers } from '../lib/formstate'

export default
function MemberPayments () {
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

  const adding = valoo(false)
  adding.on(m.redraw)

  let form
  let member
  let lastPayment

  function onedit (e) {
    pdsp(e)
    form = getForm(lastPayment)
    adding(true)
  }

  function oncancel (e) {
    pdsp(e)
    adding(false)
  }

  async function onsave (e) {
    pdsp(e)
    await (form.validate())
    if (form.hasError) return null
    store.members.addPayment(member, form.getValues())
    adding(false)
  }

  return {
    view ({ attrs }) {
      member = attrs.member
      const payments = member.payments
        .slice()
        .sort(sortBy(pmt => pmt.date))

      // stash the last payment away each time, so we can use
      // it as a template for the form
      lastPayment = payments.slice().pop()

      const isAdding = adding()

      return classify(
        stylish(style),
        m('div',
          m('table',
            m('thead',
              m('tr',
                'Date|Amount|Paid by'.split('|').map(t =>
                  m('th',
                    m(Typography.Headline6, t)
                  )
                )
              )
            ), // thead

            m('tbody',
              !payments.length && m('tr',
                m('td',
                  { colspan: 3 },
                  m(Typography.Body1,
                    'No payments recorded'
                  )
                )
              ),

              payments.map(pmt =>
                m('tr',
                  { className: 'payment' },
                  m('td',
                    m(Typography.Body1,
                      dayjs(pmt.date).format('Do MMM YY')
                    )
                  ),

                  m('td',
                    m(Typography.Body1,
                      formatters.currency(pmt.amount)
                    )
                  ),

                  m('td',
                    m(Typography.Body1,
                      pmt.method
                    )
                  )
                )
              ),

              isAdding && m(NewPayment, { form })
            ) // tbody
          ), // table

          m(Card.Actions,
            { className: 'buttons' },
            isAdding && m(Button,
              {
                key: 'cancel',
                ripple: true,
                xattrs: { onclick: oncancel }
              },
              'Cancel'
            ),

            m(Button,
              {
                key: 'add',
                ripple: true,
                raised: isAdding,
                xattrs: { onclick: isAdding ? onsave : onedit }
              },
              'Add'
            )
          ) // Card.Actions
        ) // div
      )
    }
  }
}

const NewPayment = {
  view ({ attrs: { form } }) {
    return m('tr',
      { className: 'new-payment' },
      m('td',
        m(Field, {
          label: 'Date',
          type: 'date',
          fieldState: form.$.date
        })
      ),

      m('td',
        m(Field, {
          label: 'Amount',
          fieldState: form.$.amount
        })
      ),

      m('td',
        m(Field, {
          label: 'Paid by',
          fieldState: form.$.method
        })
      )
    ) // tr
  }
}

function getForm (pmt) {
  return new FormState({
    date: new FieldState(dayjs().startOf('day').toDate())
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
