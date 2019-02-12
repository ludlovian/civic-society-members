'use strict'

import h from '../lib/hyperscript'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import classnames from 'classnames'
import stylish from '../lib/stylish'

const style = `
  :self.scrim { padding: 16px; }
  .card { padding: 16px; }
  .header { padding-bottom: 16px; }
  .body { padding-bottom: 16px; }
`

const NotFound = {
  render () {
    const cl = classnames(stylish(style), 'scrim')
    return (
      <div class={cl}>
        <Card class='card'>
          <div class='header'>
            <Typography headline4>404! Page not found.</Typography>
          </div>

          <div class='body'>
            <Typography body1>
              Looks like the page you are trying to access does not exist
            </Typography>
          </div>
        </Card>
      </div>
    )
  }
}

export default NotFound
