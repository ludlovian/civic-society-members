'use strict'

export default function pdsp (e) {
  if (!e || typeof e !== 'object') return false
  if (typeof e.preventDefault === 'function') e.preventDefault()
  if (typeof e.stopPropogation === 'function') e.stopPropogation()
  return true
}
