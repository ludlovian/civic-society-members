'use strict'

import h from '../lib/hyperscript'

import Card from '../components/Material/Card'
import Button from '../components/Material/Button'

import { views, actions } from '../store'
import stylish from '../lib/stylish'
import {
  FormState,
  FieldState,
  validators,
  formatters,
  parsers
} from '../lib/formstate'
import Field from '../components/Field'
import schema from '../schema'

export default function MemberDetails () {
  const style = `
    >form { padding-top: 20px; }

    .field>.mdc-text-field { display: flex; }
    .field>.mdc-text-field:not(.mdc-text-field--textarea) { height: 42px; }
    .field .mdc-text-field__input { padding: 6px 16px 6px; line-height: 1.2rem; }
    .field>.mdc-text-field--disabled>.mdc-text-field__input { color: rgba(0, 0, 0, 0.6); }

    .field>.mdc-select { display: flex; height: 42px; }
    .field .mdc-select__native-control { padding: 6px 52px 6px 16px; height: 42px; }
    .field .mdc-select__dropdown-icon { bottom: 12px; }
    .field>.mdc-select--disabled>.mdc-select__native-control { color: rgba(0, 0, 0, 0.6); }

    .buttons { justify-content: flex-end; }
    .buttons>.mdc-button { margin-left: 12px; }
  `

  let cleanup = []
  let form

  function onedit (member) {
    actions.route.updateData({ edit: true })
    return false
  }

  function oncancel (member) {
    form.set(member)
    actions.route.updateData({ edit: false })
    return false
  }

  function onsave (member) {
    form.validate().then(isValid => {
      if (!isValid) return
      const patch = form.getChanges()
      actions.members.updateMember(member, patch)
      actions.route.updateData({ edit: false })
    })
    return false
  }

  return {
    init (vm, { member }) {
      form = getForm(member)
    },
    hooks: {
      didMount (vm, { member }) {
        cleanup = [
          views.route.state.on(() => vm.redraw()),
          views.members.members.on(() => vm.redraw())
        ]
      },
      willUnmount () {
        cleanup.forEach(f => f())
      }
    },

    render (vm, { member }) {
      const { edit } = views.route.state().data
      const cl = stylish(style)
      return (
        <div class={cl}>
          <form>
            <Field
              class='field'
              id='sortName'
              label='Sort name'
              fieldState={form.$.sortName}
              disabled={!edit}
            />

            <Field
              class='field'
              id='address'
              label='Address'
              fieldState={form.$.address}
              type='textarea'
              rows='5'
              disabled={!edit}
            />

            <Field
              class='field'
              id='tel'
              label='Telephone'
              fieldState={form.$.tel}
              disabled={!edit}
            />

            <Field
              class='field'
              id='email'
              label='Email address'
              fieldState={form.$.email}
              disabled={!edit}
            />

            <Field.Select
              class='field'
              id='mtype'
              label='Membership type'
              fieldState={form.$.type}
              values={schema.member.type}
              disabled={!edit}
            />

            <Field
              class='field'
              id='notes'
              label='Notes'
              fieldState={form.$.notes}
              type='textarea'
              rows='3'
              disabled={!edit}
            />

            <Field.Select
              class='field'
              id='postType'
              label='Postage'
              fieldState={form.$.postType}
              values={schema.member.postType}
              disabled={!edit}
            />

            <Field.Select
              class='field'
              id='giftAid'
              label='Gift Aid'
              fieldState={form.$.giftAid}
              values={schema.member.giftAid}
              disabled={!edit}
            />

            <Field.Select
              class='field'
              id='usualMethod'
              label='Pay by'
              fieldState={form.$.usualMethod}
              values={schema.member.usualMethod}
              disabled={!edit}
            />
          </form>

          <Card.Actions class='buttons'>
            {edit && (
              <Button
                key='cancel'
                id='cancel'
                ripple
                onclick={[oncancel, member]}
              >
                Cancel
              </Button>
            )}

            <Button
              key='edit'
              id='edit'
              ripple
              raised={edit}
              onclick={[edit ? onsave : onedit, member]}
            >
              {edit ? 'Save' : 'Edit'}
            </Button>
          </Card.Actions>
        </div>
      )
    }
  }
}

function getForm (mbr) {
  return new FormState({
    sortName: new FieldState({
      value: mbr.sortName,
      validator: validators.required
    }),
    address: new FieldState({
      value: mbr.address,
      validator: validators.required
    }),
    tel: new FieldState({
      value: mbr.tel
    }),
    email: new FieldState({
      value: mbr.email
    }),
    type: new FieldState({
      value: mbr.type,
      validator: validators.required
    }),
    notes: new FieldState({
      value: mbr.notes
    }),
    giftAid: new FieldState({
      value: mbr.giftAid,
      parser: parsers.boolean,
      formatter: formatters.boolean
    }),
    postType: new FieldState({
      value: mbr.postType,
      validator: validators.required
    }),
    usualMethod: new FieldState({
      value: mbr.usualMethod
    })
  })
}
