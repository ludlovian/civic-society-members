'use strict'

import m from 'mithril'

import { classnames } from '../../lib/classify'

export default {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'material-icons')

    return (
      <i className={cl} {...xattrs} {...rest}>
        {children}
      </i>
    )
  }
}
