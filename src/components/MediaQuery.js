'use strict'

export default function MediaQuery () {
  let matches
  let unlisten

  return {
    hooks: {
      willMount (vm, { match }) {
        const mql = window.matchMedia(match)
        onUpdate(mql)

        function onUpdate (e) {
          matches = e.matches
          vm.redraw()
        }

        mql.addListener(onUpdate)
        unlisten = () => mql.removeListener(onUpdate)
      },

      willUnmount () {
        unlisten()
      }
    },

    render (vm, { children }) {
      return children[0](matches)
    }
  }
}
