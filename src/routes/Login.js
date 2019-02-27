'use strict'

import { el, vw } from '../domvm'

import { Card, Typography } from 'domvm-material'
import stylish from 'stylish'
import { actions, views } from '../store'
import { FormState, FieldState } from 'teme-formstate'
import { validators } from '../lib/forms'
import Field from '../components/Field'

export default function Login (vm) {
  const style = stylish`
    .:self.scrim { padding: 16px; }
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

  function onclick (vm) {
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
    return el(
      '.scrim',
      { class: style },
      Card(
        { class: 'card' },
        Header(),
        el('form.form', [
          ...LoginFields(form),
          Buttons({ vm, onclick, active })
        ])
      )
    )
  }
}

const Header = () =>
  el(
    '.header',
    el('div', Typography.Headline5('Login')),
    el('div', Typography.Body1('You must login to use the system'))
  )

const LoginFields = form => [
  vw(Field, {
    class: 'field',
    id: 'username',
    label: 'Email address',
    fieldState: form.fields.username,
    autofocus: true
  }),

  vw(Field, {
    class: 'field',
    id: 'password',
    label: 'Password',
    fieldState: form.fields.password,
    type: 'password'
  })
]

const Buttons = ({ vm, active, onclick }) =>
  Card.Actions(
    { class: 'buttons' },
    Card.ActionButton(
      {
        primary: true,
        default: true,
        ripple: true,
        disabled: active,
        onclick: [onclick, vm]
      },
      active ? 'Logging in...' : 'Login'
    )
  )

function doLogin (form) {
  return actions.auth
    .signIn({
      username: form.fields.username.state().value,
      password: form.fields.password.state().value
    })
    .then(() => {
      if (views.auth.signedIn()) {
        actions.route.toPage('home')
      } else {
        actions.route.toPage('error')
      }
    })
}
