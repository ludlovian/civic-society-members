'use strict'

import m from 'mithril'

import { MDCSelect } from '@material/select'

import NotchedOutline from './NotchedOutline'
import { getId } from './util'
import classify from '../../lib/classify'

export default
function Select () {
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
        ...rest } = attrs

      return m('div', { className },
        classify(
          {
            'mdc-select': true,
            'mdc-select--outlined': label,
            'mdc-select--disabled': disabled
          },
          m('div',
            m('i.mdc-select__dropdown-icon'),

            m('select',
              {
                ...rest,
                className: 'mdc-select__native-control',
                id,
                'aria-controls': helperText !== undefined && `${id}-helper-text`,
                disabled
              },
              children
            ),

            label && m(NotchedOutline,
              classify(
                {
                  'mdc-floating-label': true,
                  'mdc-floating-label--float-above': attrs.selectedIndex !== -1
                },
                m('label',
                  { for: id },
                  label
                )
              )
            )
          )
        ),

        helperText !== undefined && classify(
          {
            'mdc-select-helper-text': true,
            'mdc-select-helper-text--persistent': persistent,
            'mdc-select-helper-text--validation-msg': validationMsg
          },
          m('p',
            {
              'aria-hidden': true,
              id: `${id}-helper-text`
            },
            helperText
          )
        )
      )
    }
  }
}
