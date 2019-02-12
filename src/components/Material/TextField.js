'use strict'

import h from '../../lib/hyperscript'

import { MDCTextField } from '@material/textfield'

import NotchedOutline from './NotchedOutline'
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

const TextField = {
  template ({
    class: cl,
    id,
    type,
    label,
    disabled,
    value,
    helperText,
    persistent,
    validationMsg,
    ...rest
  }) {
    const clControl = classnames('mdc-text-field', {
      'mdc-text-field--outlined': label,
      'mdc-text-field--textarea': type === 'textarea',
      'mdc-text-field--disabled': disabled
    })

    const Elem = type === 'textarea' ? 'textarea' : 'input'

    const clLabel = classnames('mdc-floating-label', {
      'mdc-floating-label--float-above': value
    })

    const clHelperText = classnames('mdc-text-field-helper-text', {
      'mdc-text-field-helper-text--persistent': persistent,
      'mdc-text-field-helper-text--validation-msg': validationMsg
    })

    const attrs = {
      _hooks: getHooks(),
      _key: id + '-mdc-text-field'
    }
    const _type = {}
    if (type !== 'textarea') _type.type = type

    return (
      <div class={cl}>
        <div class={clControl} {...attrs}>
          <Elem
            class='mdc-text-field__input'
            {...rest}
            value={value}
            id={id}
            {..._type}
            disabled={disabled}
            aria-controls={helperText !== undefined && `${id}-helper-text`}
          />

          {label && (
            <NotchedOutline>
              <label class={clLabel} for={id}>
                {label}
              </label>
            </NotchedOutline>
          )}
        </div>

        {helperText !== undefined && (
          <p class={clHelperText} aria-hidden='true' id={`${id}-helper-text`}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
}

export default TextField
