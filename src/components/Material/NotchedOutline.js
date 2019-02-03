'use strict'

import m from 'mithril'

import { MDCNotchedOutline } from '@material/notched-outline'

export default function NotchedOutline () {
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
      return (
        <div class='mdc-notched-outline' {...xattrs} {...rest}>
          <div className='mdc-notched-outline__leading' />
          <div className='mdc-notched-outline__notch'>{children}</div>
          <div className='mdc-notched-outline__trailing' />
        </div>
      )
    }
  }
}
