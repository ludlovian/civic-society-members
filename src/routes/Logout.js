'use strict'

import h from '../lib/hyperscript'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import classnames from 'classnames'
import stylish from '../lib/stylish'
import { views, actions } from '../store'
import defer from '../lib/defer'

const style = `
  :self.scrim { padding: 16px; }

  .card { padding: 16px 16px 32px; }
  .card .header { padding-bottom: 16px; }
`
const Logout = {
  template () {
    if (views.auth.signedIn()) {
      defer(actions.auth.signOut)
    }

    return (
      <div class={classnames(stylish(style), 'scrim')}>
        <Card class='card'>
          <div class='header'>
            <Typography headline5>Logged out</Typography>
          </div>

          <div class='body'>
            <Typography body1>
              You have now logged out of the system. You must log back in before
              you can use it again.
            </Typography>
          </div>
        </Card>
      </div>
    )
  }
}
export default Logout
