'use strict'

import { el, classify } from '../domvm'

import { TextField, Select } from './Material'
import stylish from '../lib/stylish'

export default function Field (vm, { fieldState }) {
  const style = `
    :self>.mdc-text-field+.mdc-text-field-helper-text--validation-msg {
      color: red;
    }
  `
  let monitor = fieldState.state.map(() => vm.redraw(), { skip: true })

  function onchange (e) {
    fieldState.text(e.target.value)
  }

  return {
    hooks: {
      willUnmount: () => monitor.end(true)
    },

    render (vm, { fieldState, ...rest }) {
      return classify(
        stylish(style),
        TextField({
          ...rest,
          value: fieldState.state().text,
          helperText: fieldState.state().error,
          persistent: true,
          validationMsg: true,
          onchange
        })
      )
    }
  }
}

Field.Select = function FieldSelect (vm, { fieldState }) {
  const style = `
    :self>.mdc-select+.mdc-select-helper-text--validation-msg {
      color: red;
    }
  `
  function onchange (e) {
    fieldState.text(e.detail.value)
  }

  let monitor = fieldState.state.map(() => vm.redraw(), { skip: true })

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

      return classify(
        stylish(style),
        Select(
          {
            ...rest,
            helperText: fieldState.state().error,
            persistent: true,
            validationMsg: true,
            onchange
          },
          options.map(({ text, ...rest }) => el('option', rest, text))
        )
      )
    }
  }
}
