'use strict'

import h from '../lib/hyperscript'

import TextField from './Material/TextField'
import Select from './Material/Select'

import classnames from 'classnames'
import stylish from '../lib/stylish'

export default function Field (vm) {
  const style = `
    :self>.mdc-text-field+.mdc-text-field-helper-text--validation-msg {
      color: red;
    }
  `

  function onchange (fieldState, e) {
    fieldState.text(e.target.value)
    return false
  }

  let cleanup = []

  return {
    hooks: {
      didMount (vm, { fieldState }) {
        cleanup = [fieldState.state.on(() => vm.redraw())]
      },
      willUnmount () {
        cleanup.forEach(f => f())
      }
    },

    render (vm, { class: cl, fieldState, ...rest }) {
      cl = classnames(cl, stylish(style))
      return (
        <TextField
          class={cl}
          {...rest}
          value={fieldState.state().text}
          helperText={fieldState.state().error}
          persistent
          validationMsg
          onchange={[onchange, fieldState]}
        />
      )
    }
  }
}

Field.Select = function FieldSelect (vm) {
  const style = `
    :self>.mdc-select+.mdc-select-helper-text--validation-msg {
      color: red;
    }
  `

  let cleanup = []

  return {
    hooks: {
      didMount (vm, { fieldState }) {
        cleanup = [fieldState.state.on(() => vm.redraw())]
      },
      willUnmount () {
        cleanup.forEach(f => f())
      }
    },

    render (vm, { class: cl, fieldState, values, ...rest }) {
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
      cl = classnames(cl, stylish(style))

      function onchange (e) {
        fieldState.text(e.detail.value)
      }

      return (
        <Select
          class={cl}
          {...rest}
          helperText={fieldState.state().error}
          persistent
          validationMsg
          onchange={onchange}
        >
          {options.map(({ text, ...rest }) => (
            <option {...rest}>{text}</option>
          ))}
        </Select>
      )
    }
  }
}
