'use strict'

import h from '../lib/hyperscript'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import classnames from 'classnames'
import stylish from '../lib/stylish'
import { views } from '../store'

export default function Spreadsheet () {
  const style = `
    :self.scrim { padding: 16px; }

    .card { padding: 16px 16px 32px; }
    .card .header { padding-bottom: 16px; }
  `
  const url = views.auth.config().spreadsheetUrl

  return () => (
    <div class={classnames(stylish(style), 'scrim')}>
      <Card class='card'>
        <div class='header'>
          <Typography headline5>Spreadsheet</Typography>
        </div>

        <div class='body'>
          <Typography body1>
            The membership data is all stored in a Google spreadsheet. You can
            access it via the following link
          </Typography>
          <br />
          <ul>
            <li>
              <a href={url}>
                <Typography body2>{url}</Typography>
              </a>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
