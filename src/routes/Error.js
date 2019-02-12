'use strict'

import h from '../lib/hyperscript'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import classnames from 'classnames'
import { actions, views } from '../store'
import stylish from '../lib/stylish'

export default function AppError (vm) {
  const style = `
    :self.scrim { padding: 16px; height: 100% }
    .card { padding: 16px; maxWidth: 500px; margin: auto; }
    .card .header { padding-bottom: 16px; }
    .card .details { padding-bottom: 16px; overflow-x: auto; }
    .card .buttons { justify-content: flex-end; }
  `

  let cleanup = views.engine.state.on(x => vm.redraw())

  return {
    willUnmount () {
      cleanup()
    },

    render () {
      const error = views.engine.state().error
      const cl = classnames(stylish(style), 'scrim')

      return (
        <div class={cl}>
          <Card class='card'>
            <div class='header'>
              <div>
                <Typography headline5>Error</Typography>
              </div>
              <div>
                <Typography body1>
                  {error
                    ? 'The following error has occured'
                    : 'No error has occured'}
                </Typography>
              </div>
            </div>

            <pre class='details'>
              {error && (error.stack || error.message || String(error))}
            </pre>

            {error && (
              <Card.Actions class='buttons'>
                <Card.ActionButton ripple onclick={actions.engine.clearError}>
                  Clear
                </Card.ActionButton>
              </Card.Actions>
            )}
          </Card>
        </div>
      )
    }
  }
}
