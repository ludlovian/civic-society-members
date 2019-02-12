'use strict'

import h from '../../lib/hyperscript'

import { MDCSelect } from '@material/select'

import NotchedOutline from './NotchedOutline'
import classnames from 'classnames'
import memoize from '../../lib/memoize'

const getHooks = memoize(onchange => ({
  didInsert (node) {
    node.data = node.data || {}
    node.data.mdcSelect = new MDCSelect(node.el)
    if (onchange) node.data.mdcSelect.listen('MDCSelect:change', onchange)
  },

  willRecycle (prev, node) {
    node.data = prev.data
  },

  willRemove (node) {
    if (onchange) node.data.mdcSelect.unlisten('MDCSelect:change', onchange)
    node.data.mdcSelect.destroy()
  }
}))

const Select = {
  template ({
    children,
    class: cl,
    id,
    label,
    disabled,
    helperText,
    persistent,
    validationMsg,
    onchange,
    ...rest
  }) {
    const clControl = classnames({
      'mdc-select': true,
      'mdc-select--outlined': label,
      'mdc-select--disabled': disabled
    })

    const selected = children.find(node => node.attrs && node.attrs.selected)
    const hasValue = selected && selected.attrs && selected.attrs.value

    const clLabel = classnames('mdc-floating-label', {
      'mdc-floating-label--float-above': hasValue
    })

    const clHelperText = classnames('mdc-select-helper-text', {
      'mdc-select-helper-text--persistent': persistent,
      'mdc-select-helper-text--validation-msg': validationMsg
    })

    const attrs = {
      _hooks: getHooks(onchange),
      _key: id + '-mdc-select'
    }

    return (
      <div class={cl}>
        <div class={clControl} {...attrs}>
          <i class='mdc-select__dropdown-icon' />

          <select
            class='mdc-select__native-control'
            id={id}
            aria-controls={helperText !== undefined && `${id}-helper-text`}
            disabled={disabled}
            {...rest}
          >
            {children}
          </select>

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

export default Select
