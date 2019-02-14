'use strict'

import { el, classify } from '../domvm'
import { TopAppBar } from './Material'
import stylish from '../lib/stylish'
import { actions } from '../store'

export default function MemberSearch (vm) {
  vm.data = vm.data || { expanded: false, text: '' }
  const style = `
    .icon { padding-right: 20px; }

    .text-input.mdc-text-field {
      background-color: white;
      height: 40px;
    }

    .text-input.mdc-text-field.expanded { max-width: 600px; }
    .text-input.mdc-text-field.collapsed { max-width: 0.1px; }

    .text-input.mdc-text-field>.mdc-text-field__input {
      border-bottom: none;
      padding-top: 6px;
    }
  `

  function onclick (vm) {
    const data = { ...vm.data }
    data.expanded = !data.expanded
    if (data.expanded) {
      setTimeout(() => vm.refs.input.el.focus(), 20)
    }
    vm.update(data)
    return false
  }

  function onsearch (vm, e) {
    const data = { ...vm.data }
    data.text = e.target.value
    if (!data.text) data.expanded = false

    actions.route.updateData({ filter: data.text.toLowerCase() })
    vm.update(data)
    return false
  }

  return function render (vm, { expanded, text }) {
    return classify(
      stylish(style),
      TopAppBar.Section(
        { alignEnd: true },
        TopAppBar.Icon({ class: 'icon', onclick: [onclick, vm] }, 'search'),
        el(
          '.text-input.mdc-text-field',
          { class: expanded ? 'expanded' : 'collapsed' },
          el('input.mdc-text-field__input', {
            _ref: 'input',
            id: 'memberSearch',
            type: 'search',
            placeholder: 'search',
            value: text,
            onsearch: [onsearch, vm]
          })
        )
      )
    )
  }
}
