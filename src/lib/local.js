'use strict'

import { compressToBase64, decompressFromBase64 } from 'lz-string'

function loadFromLocal ({ key }) {
  if (!window) return {}
  try {
    let string = window.localStorage.getItem(key)
    if (!string) return {}
    if (string.charAt(0) !== '{') {
      string = decompressFromBase64(string)
    }
    return JSON.parse(string)
  } catch (err) {
    console.log(err)
    return {}
  }
}

function saveToLocal ({ key, compress = false }, data) {
  if (!window) return
  let string = JSON.stringify(data)
  if (compress) string = compressToBase64(string)
  try {
    window.localStorage.setItem(key, string)
  } catch (err) {
    console.log(err)
  }
}

export {
  loadFromLocal,
  saveToLocal
}
