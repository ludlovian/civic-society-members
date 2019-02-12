'use strict'

import h from '../lib/hyperscript'

import TopAppBar from './Material/TopAppBar'

import classnames from 'classnames'
import stylish from '../lib/stylish'
import { actions } from '../store'

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

export default function MemberSearch (vm) {
  let expanded = false
  let text = ''

  function onclick (vm, data) {
    expanded = !expanded
    if (expanded) {
      setTimeout(() => vm.refs.input.el.focus(), 20)
    }
    vm.redraw()
    return false
  }

  function onsearch (vm, e) {
    text = e.target.value
    if (!text) expanded = false

    actions.route.updateData({ filter: text.toLowerCase() })
    vm.redraw()
    return false
  }

  return function render (vm) {
    const cl = stylish(style)
    const clInput = classnames(
      'text-input',
      'mdc-text-field',
      expanded ? 'expanded' : 'collapsed'
    )
    return (
      <TopAppBar.Section class={cl} alignEnd>
        <TopAppBar.Icon class='icon' onclick={[onclick, vm]}>
          search
        </TopAppBar.Icon>

        <div class={clInput}>
          <input
            _ref='input'
            id='memberSearch'
            class='mdc-text-field__input'
            type='search'
            placeholder='search'
            value={text}
            onsearch={[onsearch, vm]}
          />
        </div>
      </TopAppBar.Section>
    )
  }
}
