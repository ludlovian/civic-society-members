'use strict'

import m from 'mithril'

import { MDCNotchedOutline } from '@material/notched-outline'

export default
function NotchedOutline () {
  let control

  return {
    oncreate ({ dom }) {
      control = new MDCNotchedOutline(dom)
    },

    onremove () {
      control.destroy()
    },

    view ({ children, attrs }) {
      const { xattrs = {}, ...rest } = attrs
      return m('div.mdc-notched-outline', { ...xattrs, ...rest },
        m('div.mdc-notched-outline__leading'),
        m('div.mdc-notched-outline__notch', children),
        m('div.mdc-notched-outline__trailing')
      )
    }
  }
}
