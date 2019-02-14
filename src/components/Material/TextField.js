'use strict'

import { el, hargs } from '../../domvm'
import { MDCTextField } from '@material/textfield'
import { NotchedOutline } from '.'
import classnames from 'classnames'

const getHooks = () => ({
  willRecycle (prev, node) {
    node.data = prev.data
  },
  didInsert (node) {
    node.data = node.data || {}
    node.data.mdcTextField = new MDCTextField(node.el)
  },

  willRemove (node) {
    node.data.mdcTextField.destroy()
  }
})

export default function TextField (...args) {
  const [
    {
      id,
      type,
      label,
      disabled,
      value,
      helperText,
      persistent,
      validationMsg,
      class: cl,
      ...rest
    }
  ] = hargs(args)

  return el(
    'div',
    { class: cl },
    el(
      '.mdc-text-field',
      {
        class: classnames(
          label && 'mdc-text-field--outlined',
          type === 'textarea' && 'mdc-text-field--textarea',
          disabled && 'mdc-text-field--disabled'
        ),
        _hooks: getHooks(),
        _key: id + '-mdc-text-field'
      },
      el(type === 'textarea' ? 'textarea' : 'input', {
        ...rest,
        class: 'mdc-text-field__input',
        ...(type === 'textarea' ? {} : { type }),
        value,
        disabled,
        id
      }),
      label &&
        NotchedOutline(
          el(
            'label.mdc-floating-label',
            {
              class: classnames(value && 'mdc-floating-label--float-above'),
              for: id
            },
            label
          )
        )
    ),
    helperText !== undefined &&
      el(
        'p.mdc-text-field-helper-text',
        {
          class: classnames(
            persistent && 'mdc-text-field-helper-text--persistent',
            validationMsg && 'mdc-text-field-helper-text--validation-msg'
          ),
          'aria-hidden': 'true',
          id: `${id}-helper-text`
        },
        helperText
      )
  )
}
