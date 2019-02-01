'use strict'

import m from 'mithril'

import classify from '../../lib/classify'

const LayoutGrid = {
  view ({ children, attrs }) {
    const {
      className,
      noInner,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-layout-grid',
      m('div',
        { ...xattrs, ...rest },
        noInner
          ? children
          : m(LayoutGrid.Inner, children)
      )
    )
  }
}
export default LayoutGrid

LayoutGrid.Inner = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-layout-grid__inner',
      m('div', { ...xattrs, ...rest }, children)
    )
  }
}

LayoutGrid.Cell = {
  view ({ children, attrs }) {
    const {
      className,
      cols,
      desktopCols,
      tabletCols,
      phoneCols,
      order,
      align,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      'mdc-layout-grid__cell',
      {
        [`mdc-layout-grid__cell--span-${cols}`]: cols,
        [`mdc-layout-grid__cell--span-${desktopCols}-desktop`]: desktopCols,
        [`mdc-layout-grid__cell--span-${tabletCols}-tablet`]: tabletCols,
        [`mdc-layout-grid__cell--span-${phoneCols}-phone`]: phoneCols,
        [`mdc-layout-grid__cell--order-${order}`]: order,
        [`mdc-layout-grid__cell--align-${align}`]: align
      },
      m('div', { ...xattrs, ...rest }, children)
    )
  }
}
