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
  let _fieldState

  function onchange (e) {
    pdsp(e)
    _fieldState.onChange(e.target.value)
  }

  return {
    view ({ attrs }) {
      const {
        fieldState,
        xattrs = {},
        ...rest } = attrs

      if (_fieldState !== fieldState) {
        _fieldState = fieldState
        _fieldState.notify(m.redraw)
      }

      return classify(
        stylish(style),
        m(TextField,
          {
            ...rest,
            value: fieldState.value,
            helperText: fieldState.error,
            persistent: true,
            validationMsg: true,
            xattrs: { ...xattrs, onchange }
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
  let _fieldState

  function onchange (e) {
    pdsp(e)
    _fieldState.onChange(e.detail.value)
  }

  return {
    view ({ attrs }) {
      const {
        fieldState,
        xattrs = {},
        values,
        ...rest } = attrs

      if (_fieldState !== fieldState) {
        _fieldState = fieldState
        _fieldState.notify(m.redraw)
      }
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
            xattrs: { ...xattrs, onchange }
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
