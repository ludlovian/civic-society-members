'use strict'

import { el } from '../domvm'
import teme from 'teme'
import classnames from 'classnames'
import { TextField, Select } from 'domvm-material'
import stylish from 'stylish'

export default function Field (vm, { fieldState }) {
  const style = stylish`
    .:self>.mdc-text-field+.mdc-text-field-helper-text--validation-msg {
      color: red;
    }
  `
  let monitor = teme.merge(fieldState.state)
  monitor.subscribe(() => vm.redraw())

  function onchange (e) {
    fieldState.text(e.target.value)
  }

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render (vm, { fieldState, ...rest }) {
      return TextField({
        ...rest,
        class: classnames(rest.class, style),
        value: fieldState.state().text,
        helperText: fieldState.state().error,
        persistent: true,
        validationMsg: true,
        onchange
      })
    }
  }
}

Field.Select = function FieldSelect (vm, { fieldState }) {
  const style = stylish`
    .:self>.mdc-select+.mdc-select-helper-text--validation-msg {
      color: red;
    }
  `
  function onchange (e) {
    fieldState.text(e.detail.value)
  }

  let monitor = teme.merge(fieldState.state)
  monitor.subscribe(() => vm.redraw())

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render (vm, { fieldState, values, ...rest }) {
      const curr = fieldState.state().text
      const options = values.map(([value, text]) => ({
        value,
        text,
        selected: value === curr
      }))
      if (!options.some(o => o.selected)) {
        options.unshift({
          value: curr,
          text: '',
          selected: true,
          disabled: true,
          hidden: true
        })
      }

      return Select(
        {
          ...rest,
          class: classnames(rest.class, style),
          helperText: fieldState.state().error,
          persistent: true,
          validationMsg: true,
          onchange
        },
        options.map(({ text, ...rest }) => el('option', rest, text))
      )
    }
  }
}
