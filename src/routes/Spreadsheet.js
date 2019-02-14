'use strict'

import { el, classify } from '../domvm'
import { Card, Typography } from '../components/Material'
import stylish from '../lib/stylish'
import { views } from '../store'

export default function Spreadsheet () {
  const style = `
    :self.scrim { padding: 16px; }

    .card { padding: 16px 16px 32px; }
    .card .header { padding-bottom: 16px; }
  `
  const url = views.auth.config().spreadsheetUrl

  return () =>
    classify(
      stylish(style),
      el(
        '.scrim',
        Card(
          { class: 'card' },
          el('.header', Typography.Headline5('Spreadsheet')),

          el(
            '.body',
            Typography.Body1(
              'The membership data is all stored in a Google spreadsheet. ' +
                'You can access it via the following link'
            ),
            el('br'),
            el('ul', el('li', el('a', { href: url }, Typography.Body2(url))))
          )
        )
      )
    )
}
