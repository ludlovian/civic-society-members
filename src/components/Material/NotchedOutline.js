'use strict'

import { hargs, el } from '../../domvm'
import { MDCNotchedOutline } from '@material/notched-outline'

const hooks = {
  didInsert (node) {
    node.data = node.data || {}
    node.data.mdcNotchedOutline = new MDCNotchedOutline(node.el)
  },

  willRecycle (prev, node) {
    node.data = prev.data
  },

  willRemove (node) {
    node.data.mdcNotchedOutline.destroy()
  }
}

export default function NotchedOutline (...args) {
  const [rest, children] = hargs(args)
  return el(
    '.mdc-notched-outline',
    {
      ...rest,
      _key: rest._key || rest._id || 'mdcNotchedOutline',
      _hooks: hooks
    },
    el('.mdc-notched-outline__leading'),
    el('.mdc-notched-outline__notch', children),
    el('.mdc-notched-outline__trailing')
  )
}
