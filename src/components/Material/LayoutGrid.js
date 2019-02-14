'use strict'

import { h, el, hargs, classify } from '../../domvm'

export default function LayoutGrid (...args) {
  const [{ noInner, ...rest }, children] = hargs(args)
  return el(
    '.mdc-layout-grid',
    rest,
    noInner ? children : LayoutGrid.Inner(children)
  )
}

LayoutGrid.Inner = (...args) => h('.mdc-layout-grid__inner', ...args)

LayoutGrid.Cell = (...args) => {
  const [
    { cols, desktopCols, tabletCols, phoneCols, order, align, ...rest },
    children
  ] = hargs(args)
  return classify(
    cols && `mdc-layout-grid__cell--span-${cols}`,
    desktopCols && `mdc-layout-grid__cell--span-${desktopCols}-desktop`,
    tabletCols && `mdc-layout-grid__cell--span-${tabletCols}-tablet`,
    phoneCols && `mdc-layout-grid__cell--span-${phoneCols}-phone`,
    order && `mdc-layout-grid__cell--order-${order}`,
    align && `mdc-layout-grid__cell--align-${align}`,
    el('.mdc-layout-grid__cell', rest, children)
  )
}
