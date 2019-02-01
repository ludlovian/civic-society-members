'use strict'

import m from 'mithril'
import config from '../config'
import { decompressFromBase64 } from 'lz-string'

export
function authUser (creds) {
  return callBackend({
    resource: '/auth',
    method: 'POST',
    data: creds
  })
}

export
async function fetchMembers ({ token }) {
  const query = { fmt: 'lzs' }
  const data = await callBackend({
    resource: '/members',
    method: 'GET',
    token,
    query
  })
  return JSON.parse(decompressFromBase64(data.lzs))
}

export
async function fetchFiles ({ token }) {
  const query = { fmt: 'lzs' }
  const data = await callBackend({
    resource: '/files',
    method: 'GET',
    token,
    query
  })
  return JSON.parse(decompressFromBase64(data.lzs))
}

export
function fetchConfig () {
  return callBackend({
    resource: '/config',
    method: 'GET'
  })
}

export
function postMember ({ token, member }) {
  return callBackend({
    resource: '/member',
    method: 'POST',
    token,
    data: { member }
  })
}

function callBackend (options) {
  const {
    resource,
    method,
    data = {},
    token,
    query = {}
  } = options

  const opts = {
    method,
    data,
    timeout: 30 * 1000
  }

  if (config.isTest) query.db = 'test'
  query.ts = Date.now()
  opts.url = `${config.backend}${resource}?${m.buildQueryString(query)}`

  if (token) opts.headers = { Authorization: 'Bearer ' + token }

  return m.request(opts)
}
