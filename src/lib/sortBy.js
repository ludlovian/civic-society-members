'use strict'

export default
function sortBy (selector, desc = false) {
  return (a, b) => {
    const aData = selector(a)
    const bData = selector(b)
    if (desc) {
      return aData < bData ? 1 : bData < aData ? -1 : 0
    } else {
      return aData < bData ? -1 : bData < aData ? 1 : 0
    }
  }
}
