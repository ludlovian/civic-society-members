'use strict'

export default function Trigger () {
  let res
  let rej
  const p = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })
  p.fire = res
  p.cancel = rej
  return p
}
