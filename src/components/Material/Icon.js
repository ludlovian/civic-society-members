'use strict'

import m from 'mithril'

import classify from '../../lib/classify'

export default {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'material-icons',
      m('i', { ...xattrs, ...rest }, children)
    )
  }
}
