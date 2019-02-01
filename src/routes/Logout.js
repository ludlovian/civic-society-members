'use strict'

import m from 'mithril'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import classify from '../lib/classify'
import stylish from '../lib/stylish'
import store from '../store'

const style = `
  :self.scrim { padding: 16px; }

  .card { padding: 16px 16px 32px; }
  .card .header { padding-bottom: 16px; }
`
export default {
  oncreate () {
    if (store.auth.isSignedIn()) store.auth.signOut()
  },

  view () {
    return classify(
      stylish(style),
      'scrim',
      m('div',
        classify(
          'card',
          m(Card,
            m('div.header',
              m(Typography.Headline5, 'Logged out')
            ),

            m('div.body',
              m('Typography.Body1',
                'You have now logged out of the system. ',
                'You must log back in before you can use it again.'
              )
            )
          )
        )
      )
    )
  }
}
