'use strict'

export default function MediaQuery () {
  let mql
  let matches
  let unlisten = () => {}

  function createQuery (vm, match) {
    const mql = window.matchMedia(match)
    matches = mql.matches
    function onUpdate (e) {
      matches = e.matches
      vm.redraw()
    }
    mql.addListener(onUpdate)
    unlisten = () => mql.removeListener(onUpdate)
  }

  return {
    hooks: {
      willUnmount () {
        unlisten()
      }
    },
    render (vm, { match, children }) {
      if (!mql) createQuery(vm, match)
      return children[0](matches)
    }
  }
}
