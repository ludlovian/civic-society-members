'use strict'

export default function MediaQuery (vm, { match }) {
  const mql = window.matchMedia(match)
  let matches = mql.matches
  function onUpdate (e) {
    matches = e.matches
    vm.redraw()
  }
  mql.addListener(onUpdate)
  let unlisten = () => mql.removeListener(onUpdate)

  return {
    hooks: {
      willUnmount: unlisten
    },
    render: (vm, { render }) => render(matches)
  }
}
