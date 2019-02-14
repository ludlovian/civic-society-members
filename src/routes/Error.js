'use strict'

import { el, classify } from '../domvm'
import { Card, Typography } from '../components/Material'
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
  const monitor = views.engine.state.map(() => vm.redraw(), { skip: true })

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render () {
      const error = views.engine.state().error
      return classify(
        stylish(style),
        el(
          '.scrim',
          classify(
            'card',
            Card(Heading(), ErrorDetails(error), error && Buttons())
          )
        )
      )
    }
  }
}

const Heading = () => el('.header', Typography.Headline5('Error'))

const ErrorDetails = error =>
  el(
    '.body',
    el(
      'div',
      Typography.Body1(
        error ? 'The following error has occured' : 'No error has occured'
      )
    ),
    el('pre.details', error && (error.stack || error.message || String(error)))
  )

const Buttons = () =>
  Card.Actions(
    { class: 'buttons' },
    Card.ActionButton(
      {
        ripple: true,
        onclick: actions.engine.clearError
      },
      'Clear'
    )
  )
