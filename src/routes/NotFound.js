'use strict'

import { el } from '../domvm'
import { Card, Typography } from 'domvm-material'
import stylish from 'stylish'

export default function NotFound () {
  const style = stylish`
    .:self.scrim { padding: 16px; }
    .card { padding: 16px; }
    .header { padding-bottom: 16px; }
    .body { padding-bottom: 16px; }
  `
  return () =>
    el(
      '.scrim',
      { class: style },
      Card(
        { class: 'card' },
        el('.header', Typography.Headline4('404! Page not found.')),
        el(
          '.body',
          Typography.Body1(
            'Looks like the page you are trying to access does not exist'
          )
        )
      )
    )
}
