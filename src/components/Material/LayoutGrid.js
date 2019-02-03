'use strict'

import m from 'mithril'

import { classnames } from '../../lib/classify'

const LayoutGrid = {
  view ({ children, attrs }) {
    const { className, noInner, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-layout-grid')

    return (
      <div className={cl} {...xattrs} {...rest}>
        {noInner ? children : <LayoutGrid.Inner>{children}</LayoutGrid.Inner>}
      </div>
    )
  }
}
export default LayoutGrid

LayoutGrid.Inner = {
  view ({ children, attrs }) {
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(className, 'mdc-layout-grid__inner')

    return (
      <div className={cl} {...xattrs} {...rest}>
        {children}
      </div>
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
      ...rest
    } = attrs
    const cl = classnames(className, 'mdc-layout-grid__cell', {
      [`mdc-layout-grid__cell--span-${cols}`]: cols,
      [`mdc-layout-grid__cell--span-${desktopCols}-desktop`]: desktopCols,
      [`mdc-layout-grid__cell--span-${tabletCols}-tablet`]: tabletCols,
      [`mdc-layout-grid__cell--span-${phoneCols}-phone`]: phoneCols,
      [`mdc-layout-grid__cell--order-${order}`]: order,
      [`mdc-layout-grid__cell--align-${align}`]: align
    })

    return (
      <div className={cl} {...xattrs} {...rest}>
        {children}
      </div>
    )
  }
}
