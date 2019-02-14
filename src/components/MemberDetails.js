'use strict'

import { el, classify, vw } from '../domvm'
import { Card, Button } from '../components/Material'
import { views, actions } from '../store'
import stylish from '../lib/stylish'
import stream from '../lib/stream'
import {
  FormState,
  FieldState,
  validators,
  formatters,
  parsers
} from '../lib/formstate'
import Field from '../components/Field'
import schema from '../schema'

export default function MemberDetails (vm, { member }) {
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

  let monitor = stream.combine(
    () => vm.redraw(),
    [views.route.state, views.members.members],
    { skip: true }
  )

  let form = getForm(member)
  window.form = form

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
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render (vm, { member }) {
      const { edit } = views.route.state().data
      return classify(
        stylish(style),
        el(
          'div',
          el('form', MemberFields({ form, edit })),
          MemberButtons({ edit, member, onsave, oncancel, onedit })
        )
      )
    }
  }
}

const MemberFields = ({ form, edit }) => [
  vw(Field, {
    class: 'field',
    id: 'sortName',
    label: 'Sort name',
    fieldState: form.$.sortName,
    disabled: !edit
  }),
  vw(Field, {
    class: 'field',
    id: 'address',
    label: 'Address',
    fieldState: form.$.address,
    type: 'textarea',
    rows: 5,
    disabled: !edit
  }),
  vw(Field, {
    class: 'field',
    id: 'tel',
    label: 'Telephone',
    fieldState: form.$.tel,
    disabled: !edit
  }),
  vw(Field, {
    class: 'field',
    id: 'email',
    label: 'Email address',
    fieldState: form.$.email,
    disabled: !edit
  }),
  vw(Field.Select, {
    class: 'field',
    id: 'mtype',
    label: 'Membership type',
    fieldState: form.$.type,
    values: schema.member.type,
    disabled: !edit
  }),
  vw(Field, {
    class: 'field',
    id: 'notes',
    label: 'Notes',
    fieldState: form.$.notes,
    type: 'textarea',
    rows: 3,
    disabled: !edit
  }),
  vw(Field.Select, {
    class: 'field',
    id: 'postType',
    label: 'Postage',
    fieldState: form.$.postType,
    values: schema.member.postType,
    disabled: !edit
  }),
  vw(Field.Select, {
    class: 'field',
    id: 'giftAid',
    label: 'Gift Aid',
    fieldState: form.$.giftAid,
    values: schema.member.giftAid,
    disabled: !edit
  }),
  vw(Field.Select, {
    class: 'field',
    id: 'usualMethod',
    label: 'Pay by',
    fieldState: form.$.usualMethod,
    values: schema.member.usualMethod,
    disabled: !edit
  })
]

const MemberButtons = ({ edit, member, oncancel, onsave, onedit }) =>
  Card.Actions(
    { class: 'buttons' },
    edit &&
      Button(
        {
          _key: 'cancel',
          id: 'cancel',
          ripple: true,
          onclick: [oncancel, member]
        },
        'Cancel'
      ),
    Button(
      {
        _key: 'edit',
        id: 'edit',
        ripple: true,
        raised: edit,
        onclick: [edit ? onsave : onedit, member]
      },
      edit ? 'Save' : 'Edit'
    )
  )

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
