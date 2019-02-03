'use strict'

import m from 'mithril'

import { MDCTextField } from '@material/textfield'

import NotchedOutline from './NotchedOutline'
import { getId } from './util'
import { classnames } from '../../lib/classify'

export default function TextField () {
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
        ...rest
      } = attrs

      const cl = classnames('mdc-text-field', {
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

      return (
        <div className={className}>
          <div className={cl}>
            <Elem
              className='mdc-text-field__input'
              {...xattrs}
              {...rest}
              value={value}
              id={id}
              type={type !== 'textarea' && type}
              disabled={disabled}
              aria-controls={helperText !== undefined && `${id}-helper-text`}
            />

            {label && (
              <NotchedOutline>
                <label className={clLabel} for={id}>
                  {label}
                </label>
              </NotchedOutline>
            )}
          </div>

          {helperText !== undefined && (
            <p
              className={clHelperText}
              aria-hidden='true'
              id={`${id}-helper-text`}
            >
              {helperText}
            </p>
          )}
        </div>
      )
    }
  }
}
