'use strict'

import h from '../lib/hyperscript'

import Card from '../components/Material/Card'
import Typography from '../components/Material/Typography'

import classnames from 'classnames'
import stylish from '../lib/stylish'
import { actions, views } from '../store'
import { FormState, FieldState, validators } from '../lib/formstate'
import Field from '../components/Field'

export default function Login (vm) {
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
    username: new FieldState({
      value: '',
      validator: [validators.required, validators.email]
    }),
    password: new FieldState({
      value: '',
      validator: validators.required
    })
  })

  function onclick () {
    form.validate().then(isValid => {
      if (isValid) {
        vm.update({ active: true })
        return doLogin(form)
      } else {
        vm.redraw()
      }
    })
    return false
  }

  return function render (vm, { active = false } = {}) {
    const cl = classnames(stylish(style), 'scrim')
    return (
      <div class={cl}>
        <Card class='card'>
          <div class='header'>
            <div>
              <Typography headline5>Login</Typography>
            </div>
            <div>
              <Typography body1>You must login to use the system</Typography>
            </div>
          </div>

          <form class='form'>
            <Field
              class='field'
              id='username'
              label='Email address'
              fieldState={form.$.username}
              autofocus
            />

            <Field
              class='field'
              id='password'
              label='Password'
              fieldState={form.$.password}
              type='password'
            />

            <Card.Actions class='buttons'>
              <Card.ActionButton
                primary
                default
                ripple
                disabled={active}
                onclick={[onclick]}
              >
                {active ? 'Logging in...' : 'Login'}
              </Card.ActionButton>
            </Card.Actions>
          </form>
        </Card>
      </div>
    )
  }
}

function doLogin (form) {
  return actions.auth
    .signIn({
      username: form.$.username.state().value,
      password: form.$.password.state().value
    })
    .then(() => {
      if (views.auth.signedIn()) {
        actions.route.toPage('home')
      } else {
        actions.route.toPage('error')
      }
    })
}
