'use strict'

import m from 'mithril'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import classify from '../lib/classify'
import stylish from '../lib/stylish'

const style = `
  :self.scrim { padding: 16px; }
  .card { padding: 16px; }
  .header { padding-bottom: 16px; }
  .body { padding-bottom: 16px; }
`
export default {
  view () {
    return classify(
      stylish(style),
      <div className='scrim'>
        <Card className='card'>
          <div className='header'>
            <Typography headline4>404! Page not found.</Typography>
          </div>

          <div className='body'>
            <Typography body1>
              Looks like the page you are trying to access does not exist
            </Typography>
          </div>
        </Card>
      </div>
    )
  }
}
