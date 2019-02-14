'use strict'

import { el, hargs, classify } from '../../domvm'
import { MDCSelect } from '@material/select'
import { NotchedOutline } from '.'
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

export default function Select (...args) {
  const [
    {
      class: cl,
      id,
      label,
      disabled,
      helperText,
      persistent,
      validationMsg,
      onchange,
      ...rest
    },
    children
  ] = hargs(args)

  const selected = children.find(node => node.attrs && node.attrs.selected)
  const hasValue = selected && selected.attrs && selected.attrs.value

  return el(
    'div',
    { class: cl },
    el(
      '.mdc-select',
      {
        class: classnames(
          label && 'mdc-select--outlined',
          disabled && 'mdc-select--disabled'
        ),
        _hooks: getHooks(onchange),
        _key: `${id}-mdc-select`
      },
      el('i.mdc-select__dropdown-icon'),
      el(
        'select.mdc-select__native-control',
        {
          ...rest,
          id,
          'aria-controls': helperText !== undefined && `${id}-helper-text`,
          disabled
        },
        children
      ),
      label &&
        NotchedOutline(
          classify(
            hasValue && 'mdc-floating-label--float-above',
            el('label.mdc-floating-label', { for: id }, label)
          )
        )
    ),

    helperText !== undefined &&
      el(
        'p.mdc-select-helper-text',
        {
          class: classnames(
            persistent && 'mdc-select-helper-text--persistent',
            validationMsg && 'mdc-select-helper-text--validation-msg'
          ),
          'aria-hidden': 'true',
          id: `${id}-helper-text`
        },
        helperText
      )
  )
}
