'use strict'

import m from 'mithril'

import { MDCSelect } from '@material/select'

import NotchedOutline from './NotchedOutline'
import { getId } from './util'
import { classnames } from '../../lib/classify'

export default function Select () {
  let id
  let control

  return {
    oninit ({ attrs }) {
      id = getId(id || attrs.id)
    },

    oncreate ({ dom, attrs }) {
      const { xattrs = {} } = attrs
      control = new MDCSelect(dom.firstElementChild)
      if (xattrs.onchange) control.listen('MDCSelect:change', xattrs.onchange)
    },

    onremove ({ attrs }) {
      const { xattrs = {} } = attrs
      if (xattrs.onchange) control.unlisten('MDCSelect:change', xattrs.onchange)
      control.destroy()
    },

    view ({ children, attrs }) {
      const {
        className,
        label,
        disabled,
        helperText,
        persistent,
        validationMsg,
        xattrs, // deliberatly excluded. The only hook is onchange above
        ...rest
      } = attrs

      const cl = classnames({
        'mdc-select': true,
        'mdc-select--outlined': label,
        'mdc-select--disabled': disabled
      })

      const clLabel = classnames('mdc-floating-label', {
        'mdc-floating-label--float-above': attrs.selectedIndex !== -1
      })

      const clHelperText = classnames('mdc-select-helper-text', {
        'mdc-select-helper-text--persistent': persistent,
        'mdc-select-helper-text--validation-msg': validationMsg
      })

      return (
        <div className={className}>
          <div className={cl}>
            <i className='mdc-select__dropdown-icon' />

            <select
              className='mdc-select__native-control'
              id={id}
              aria-controls={helperText !== undefined && `${id}-helper-text`}
              disabled={disabled}
              {...rest}
            >
              {children}
            </select>

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
