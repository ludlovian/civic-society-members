'use strict'

import m from 'mithril'
import mithril3, { defer } from '../../lib/mithril3'

import { MDCRipple } from '@material/ripple'

import { classnames } from '../../lib/classify'

export default mithril3(Button)
function Button (vnode, prev, state = {}, update) {
  const { children } = vnode
  const {
    className,
    ripple,
    href,
    dense,
    raised,
    unelevated,
    outlined,
    primary,
    secondary,
    ...rest
  } = vnode.attrs

  // on first time, we create the MDC component (deferring
  // to allow the vnode to be rendered
  if (!prev) {
    defer(() => {
      if (ripple) {
        update({
          ...state,
          mdcRipple: new MDCRipple(vnode.dom)
        })
      }
    })
  }

  const El = href ? 'a' : 'button'
  const cl = classnames(className, 'mdc-button', {
    'mdc-button--dense': dense,
    'mdc-button--raised': raised,
    'mdc-button--unelevated': unelevated,
    'mdc-button--outlined': outlined,
    'mdc-theme--primary-bg': primary,
    'mdc-theme--secondary-bg': secondary
  })

  const view = (
    <El className={cl} {...rest}>
      <span className='mdc-button__label'>{children}</span>
    </El>
  )

  return {
    view,
    next: state,
    onremove () {
      if (state.mdcRipple) state.mdcRipple.destroy()
    }
  }
}
