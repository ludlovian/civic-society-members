'use strict'

import { el } from '../domvm'
import { Card, Typography } from 'domvm-material'
import stylish from 'stylish'
import { views, actions } from '../store'
import defer from '../lib/defer'

export default function Logout () {
  const style = stylish`
    .:self.scrim { padding: 16px; }

    .card { padding: 16px 16px 32px; }
    .card .header { padding-bottom: 16px; }
  `
  return () => {
    if (views.auth.signedIn()) {
      defer(actions.auth.signOut)
    }

    return el(
      'div.scrim',
      { class: style },
      Card(
        { class: 'card' },
        el('.header', Typography.Headline5('Logged out')),
        el(
          '.body',
          Typography.Body1(
            'You have now logged out of the system. ' +
              'You must log back in before you can use it again.'
          )
        )
      )
    )
  }
}
