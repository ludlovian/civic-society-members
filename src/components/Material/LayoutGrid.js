'use strict'

import h from '../../lib/hyperscript'
import classnames from 'classnames'

const LayoutGrid = {
  template ({ children, class: cl, noInner, ...rest }) {
    cl = classnames(cl, 'mdc-layout-grid')

    return (
      <div class={cl} {...rest}>
        {noInner ? children : <LayoutGrid.Inner>{children}</LayoutGrid.Inner>}
      </div>
    )
  }
}

LayoutGrid.Inner = {
  template ({ children, class: cl, ...rest }) {
    cl = classnames(cl, 'mdc-layout-grid__inner')

    return (
      <div class={cl} {...rest}>
        {children}
      </div>
    )
  }
}

LayoutGrid.Cell = {
  template ({
    children,
    class: cl,
    cols,
    desktopCols,
    tabletCols,
    phoneCols,
    order,
    align,
    ...rest
  }) {
    cl = classnames(
      cl,
      'mdc-layout-grid__cell',
      cols && `mdc-layout-grid__cell--span-${cols}`,
      desktopCols && `mdc-layout-grid__cell--span-${desktopCols}-desktop`,
      tabletCols && `mdc-layout-grid__cell--span-${tabletCols}-tablet`,
      phoneCols && `mdc-layout-grid__cell--span-${phoneCols}-phone`,
      order && `mdc-layout-grid__cell--order-${order}`,
      align && `mdc-layout-grid__cell--align-${align}`
    )

    return (
      <div class={cl} {...rest}>
        {children}
      </div>
    )
  }
}

export default LayoutGrid
