'use strict'

import h from '../../lib/hyperscript'
import classnames from 'classnames'

const Icon = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'material-icons')
    return (
      <i class={cl} {...rest}>
        {children}
      </i>
    )
  }
}
export default Icon
