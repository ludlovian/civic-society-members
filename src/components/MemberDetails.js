'use strict'

import m from 'mithril'

import Card from '../components/Material/Card'
import Button from '../components/Material/Button'

import store from '../store'
import valoo from '../lib/valoo'
import classify from '../lib/classify'
import stylish from '../lib/stylish'
import { FormState, FieldState, validators, formatters, parsers } from '../lib/formstate'
import Field from '../components/Field'
import pdsp from '../lib/pdsp'
import schema from '../schema'

const { required } = validators

export default
function MemberDetails () {
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
  let editing = valoo(false)
  editing.on(m.redraw)

  let form
  let member

  function onedit (e) {
    pdsp(e)
    editing(true)
  }

  function oncancel (e) {
    pdsp(e)
    form.set(member)
    editing(false)
  }

  async function onsave (e) {
    pdsp(e)
    await form.validate()
    if (form.hasError) return
    const patch = form.getChanges()
    store.members.updateMember(member, patch)
    editing(false)
  }

  return {
    oninit ({ attrs }) {
      member = attrs.member
      form = getForm(member)
      if (!member.sortName) editing(true)
    },

    view ({ attrs }) {
      member = attrs.member
      const isEditing = editing()
      if (!isEditing) form.set(member)

      return classify(
        stylish(style),
        m('div',
          m('form',
            m(Field, {
              className: 'field',
              label: 'Sort name',
              fieldState: form.$.sortName,
              disabled: !isEditing
            }),

            m(Field, {
              className: 'field',
              label: 'Address',
              fieldState: form.$.address,
              type: 'textarea',
              rows: 5,
              disabled: !isEditing
            }),

            m(Field, {
              className: 'field',
              label: 'Telephone',
              fieldState: form.$.tel,
              disabled: !isEditing
            }),

            m(Field, {
              className: 'field',
              label: 'Email address',
              fieldState: form.$.email,
              disabled: !isEditing
            }),

            m(Field.Select, {
              className: 'field',
              label: 'Membership type',
              fieldState: form.$.type,
              values: schema.member.type,
              disabled: !isEditing
            }),

            m(Field, {
              className: 'field',
              label: 'Notes',
              fieldState: form.$.notes,
              type: 'textarea',
              rows: 3,
              disabled: !isEditing
            }),

            m(Field.Select, {
              className: 'field',
              label: 'Postage',
              fieldState: form.$.postType,
              values: schema.member.postType,
              disabled: !isEditing
            }),

            m(Field.Select, {
              className: 'field',
              label: 'Gift Aid',
              fieldState: form.$.giftAid,
              values: schema.member.giftAid,
              disabled: !isEditing
            }),

            m(Field.Select, {
              className: 'field',
              label: 'Pay by',
              fieldState: form.$.usualMethod,
              values: schema.member.usualMethod,
              disabled: !isEditing
            })
          ), // form

          m(Card.Actions,
            { className: 'buttons' },
            isEditing && m(Button,
              {
                key: 'cancel',
                ripple: true,
                xattrs: { onclick: oncancel }
              },
              'Cancel'
            ),

            m(Button,
              {
                key: 'edit',
                ripple: true,
                raised: isEditing,
                xattrs: { onclick: isEditing ? onsave : onedit }
              },
              isEditing ? 'Save' : 'Edit'
            )
          ) // Card.Actions
        ) // div
      )
    }
  }
}

function getForm (mbr) {
  return new FormState({
    sortName: new FieldState(mbr.sortName)
      .validators(required),

    address: new FieldState(mbr.address)
      .validators(required),

    tel: new FieldState(mbr.tel),

    email: new FieldState(mbr.email),

    type: new FieldState(mbr.type)
      .validators(required),

    notes: new FieldState(mbr.notes),

    giftAid: new FieldState(mbr.giftAid)
      .parser(parsers.boolean)
      .formatter(formatters.boolean),

    postType: new FieldState(mbr.postType)
      .validators(required),

    usualMethod: new FieldState(mbr.usualMethod)
  })
}