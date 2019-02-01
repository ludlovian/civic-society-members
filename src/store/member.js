'use strict'

const searchFields = [
  'id',
  'sortName',
  'address',
  'tel',
  'email',
  'notes'
]

export function searchText (mbr) {
  return searchFields
    .map(fld => String(mbr[fld] || '')
      .replace(/[\n ]+/g, ' ')
      .toLowerCase()
    ).join(' ')
}

export const isLife = m => /^L/.test(m.type)
export const isJoint = m => /^A[23]|L2/.test(m.type)
export const isCorporate = m => /^C/.test(m.type)
