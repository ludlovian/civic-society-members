'use strict'

let nextId = 100

export function getId (id) {
  if (id) return id
  id = `id-${nextId++}`
  return id
}
