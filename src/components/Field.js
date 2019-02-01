'use strict'

import m from 'mithril'

import TextField from './Material/TextField'
import Select from './Material/Select'

import classify from '../lib/classify'
import stylish from '../lib/stylish'
import pdsp from '../lib/pdsp'

export default
function Field () {
  const style = `
    :self>.mdc-text-field+.mdc-text-field-helper-text--validation-msg {
      color: red;
    }
  `
  let fieldState

  function onChange (e) {
    pdsp(e)
    fieldState.onChange(e.target.value)
  }

  return {
    oninit ({ attrs }) {
      fieldState = attrs.fieldState
      fieldState.notify(m.redraw)
    },

    view ({ attrs }) {
      const xattrs = attrs.xattrs || {}
      return classify(
        stylish(style),
        m(TextField,
          {
            ...attrs,
            value: fieldState.value,
            helperText: fieldState.error,
            persistent: true,
            validationMsg: true,
            xattrs: { ...xattrs, onchange: onChange }
          }
        )
      )
    }
  }
}

Field.Select = function FieldSelect () {
  const style = `
    :self>.mdc-select+.mdc-select-helper-text--validation-msg {
      color: red;
    }
  `
  let fieldState

  function onChange (e) {
    pdsp(e)
    fieldState.onChange(e.detail.value)
  }

  return {
    oninit ({ attrs }) {
      fieldState = attrs.fieldState
      fieldState.notify(m.redraw)
    },

    view ({ attrs }) {
      const {
        fieldState,
        xattrs = {},
        values,
        ...rest } = attrs
      const selectedIndex = values.findIndex(
        ([ value, text ]) => value === fieldState.value
      )
      return classify(
        stylish(style),
        m(Select,
          {
            ...rest,
            selectedIndex,
            helperText: fieldState.error,
            persistent: true,
            validationMsg: true,
            xattrs: { ...xattrs, onchange: onChange }
          },
          values.map(([ value, text ]) =>
            m('option',
              { value, selected: value === fieldState.value },
              text
            )
          )
        )
      )
    }
  }
}
