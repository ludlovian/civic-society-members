'use strict'

import h from '../../lib/hyperscript'

import { MDCNotchedOutline } from '@material/notched-outline'

const NotchedOutline = {
  template ({ children, ...rest }) {
    const attrs = {
      ...rest,
      _key: rest._key || rest._id || 'mdcNotchedOutline',
      _hooks: { didInsert, willRecycle, willRemove }
    }

    return (
      <div class='mdc-notched-outline' {...attrs}>
        <div class='mdc-notched-outline__leading' />
        <div class='mdc-notched-outline__notch'>{children}</div>
        <div class='mdc-notched-outline__trailing' />
      </div>
    )
  }
}

function willRecycle (prev, node) {
  node.data = prev.data
}

function didInsert (node) {
  node.data = node.data || {}
  node.data.mdcNotchedOutline = new MDCNotchedOutline(node.el)
}

function willRemove (node) {
  node.data.mdcNotchedOutline.destroy()
}

export default NotchedOutline
