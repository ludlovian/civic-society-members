'use strict'

import m from 'mithril'

import TopAppBar from './Material/TopAppBar'

import classify from '../lib/classify'
import valoo from '../lib/valoo'
import stylish from '../lib/stylish'
import pdsp from '../lib/pdsp'

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

export default
function MemberSearch () {
  let input
  let expanded = valoo(false)
  let text = ''

  expanded.on(m.redraw)

  function onClickIcon (e) {
    pdsp(e)
    expanded(!expanded())
    if (expanded()) setTimeout(() => input.focus(), 20)
  }

  function onSearch (e) {
    pdsp(e)
    text = e.target.value.toLowerCase()
    const url = text ? `/members/${text}` : '/members'
    if (url !== m.route.get()) m.route.set(url)
    if (!text) expanded(false)
  }

  return {
    oncreate ({ dom }) {
      input = dom.querySelector('.mdc-text-field__input')
    },

    view () {
      return classify(
        stylish(style),
        m(TopAppBar.Section, { alignEnd: true },
          classify(
            'icon',
            m(TopAppBar.Icon,
              { xattrs: { onclick: onClickIcon } },
              'search'
            )
          ),

          classify(
            'text-input',
            'mdc-text-field',
            {
              expanded: expanded(),
              collapsed: !expanded()
            },
            m('div',
              m('input.mdc-text-field__input', {
                type: 'search',
                placeholder: 'search',
                value: text,
                onsearch: onSearch
              })
            )
          )
        )
      )
    }
  }
}
