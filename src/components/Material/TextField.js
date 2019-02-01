'use strict'

import m from 'mithril'

import { MDCTextField } from '@material/textfield'

import NotchedOutline from './NotchedOutline'
import { getId } from './util'
import classify from '../../lib/classify'

export default
function TextField () {
  let id
  let control

  return {
    oninit ({ attrs }) {
      id = getId(id || attrs.id)
    },

    oncreate ({ dom, attrs }) {
      control = new MDCTextField(dom.firstElementChild)
    },

    onremove () {
      control.destroy()
    },

    view ({ attrs }) {
      const {
        className,
        label,
        disabled,
        type,
        value,
        helperText,
        persistent,
        validationMsg,
        xattrs = {},
        ...rest } = attrs

      return m('div', { className },
        classify(
          {
            'mdc-text-field': true,
            'mdc-text-field--outlined': label,
            'mdc-text-field--textarea': type === 'textarea',
            'mdc-text-field--disabled': disabled
          },
          m('div',
            m(type === 'textarea' ? 'textarea' : 'input',
              {
                ...xattrs,
                ...rest,
                className: 'mdc-text-field__input',
                value,
                type: type === 'textarea' ? undefined : type,
                id,
                disabled,
                'aria-controls': helperText !== undefined && `${id}-helper-text`
              }
            ),

            label && m(NotchedOutline,
              classify(
                {
                  'mdc-floating-label': true,
                  'mdc-floating-label--float-above': value
                },
                m('label',
                  { for: id },
                  label
                )
              )
            )
          )
        ),

        helperText !== undefined && classify(
          {
            'mdc-text-field-helper-text': true,
            'mdc-text-field-helper-text--persistent': persistent,
            'mdc-text-field-helper-text--validation-msg': validationMsg
          },
          m('p',
            {
              'aria-hidden': true,
              id: `${id}-helper-text`
            },
            helperText
          )
        )
      )
    }
  }
}
