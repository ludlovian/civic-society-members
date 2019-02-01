'use strict'

import m from 'mithril'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import classify from '../lib/classify'
import stylish from '../lib/stylish'
import store from '../store'
import valoo from '../lib/valoo'
import { FormState, FieldState, validators } from '../lib/formstate'
import pdsp from '../lib/pdsp'
import Field from '../components/Field'

export default
function Login () {
  const style = `
    :self.scrim { padding: 16px; }
    .card { padding: 16px; max-width: 400px; margin: auto; }
    .header { margin: 0 0 16px }
    .form { margin: 16px 0 16px; }
    .field { margin: 8px 0 8px; }
    .field>.mdc-text-field { display: flex; }
    .buttons { justify-content: flex-end; }
  `

  const form = new FormState({
    username: new FieldState('')
      .validators(validators.required, validators.email),
    password: new FieldState('')
      .validators(validators.required)
  })

  let active = valoo(false)
  active.on(m.redraw)

  async function doLogin (e) {
    pdsp(e)
    await form.validate()
    if (form.hasError) return
    active(true)
    await store.auth.signIn({
      username: form.$.username.$,
      password: form.$.password.$
    })
    if (store.auth.isSignedIn()) {
      m.route.set('/members')
    } else {
      m.route.set('/error')
    }
    // this is a bit pointless as we are routing away from here, but
    // what the heck
    active(false)
  }

  return {
    view () {
      const isActive = active()
      return classify('scrim', stylish(style),
        m('div',
          classify('card',
            m(Card,
              m('div.header',
                m('div', m(Typography.Headline5, 'Login')),
                m('div', m(Typography.Body1, 'You must login to use the system'))
              ),

              m('form.form',
                classify('field', m(Field, {
                  label: 'Email address',
                  fieldState: form.$.username,
                  xattrs: { autofocus: true }
                })),

                classify('field', m(Field, {
                  label: 'Password',
                  fieldState: form.$.password,
                  type: 'password'
                })),

                classify('buttons',
                  m(Card.Actions,
                    m(Card.ActionButton,
                      {
                        primary: true,
                        default: true,
                        ripple: true,
                        disabled: isActive,
                        xattrs: { onclick: doLogin }
                      },
                      isActive ? 'Logging in...' : 'Login'
                    )
                  )
                )
              )
            )
          )
        )
      )
    }
  }
}
