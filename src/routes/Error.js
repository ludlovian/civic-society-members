'use strict'

import m from 'mithril'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import store from '../store'
import classify from '../lib/classify'
import stylish from '../lib/stylish'
import pdsp from '../lib/pdsp'

export default
function AppError () {
  const style = `
    :self.scrim { padding: 16px; height: 100% }
    .card { padding: 16px; maxWidth: 500px; margin: auto; }
    .card .header { padding-bottom: 16px; }
    .card .details { padding-bottom: 16px; overflow-x: auto; }
    .card .buttons { justify-content: flex-end; }
  `

  function clearError (e) {
    pdsp(e)
    store.engine.clearError()
  }

  return {
    view () {
      const error = store.engine.getError()

      return classify(
        stylish(style),
        'scrim',
        m('div',
          classify(
            'card',
            m(Card,
              m('div.header',
                m('div', m(Typography.Headline5, 'Error')),
                m('div', m(Typography.Body1,
                  error ? 'The following error has occured'
                    : 'No error has occured'
                ))
              ),

              m('pre.details',
                error && (error.stack || error.message || String(error))
              ),

              error && classify(
                'buttons',
                m(Card.Actions,
                  m(Card.ActionButton, {
                    ripple: true,
                    xattrs: { onclick: clearError }
                  }, 'Clear')
                )
              )
            )
          )
        )
      )
    }
  }
}
