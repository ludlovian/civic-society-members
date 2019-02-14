'use strict'

import { el, classify } from '../domvm'
import { Card, Typography } from '../components/Material'
import stylish from '../lib/stylish'

export default function NotFound () {
  const style = `
    :self.scrim { padding: 16px; }
    .card { padding: 16px; }
    .header { padding-bottom: 16px; }
    .body { padding-bottom: 16px; }
  `
  return () =>
    classify(
      stylish(style),
      el(
        '.scrim',
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
    )
}
