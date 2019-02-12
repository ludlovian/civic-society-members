'use strict'

import pTimeout from 'p-timeout'
import config from '../config'
import { decompressFromBase64 } from 'lz-string'
import { buildQuery } from './url'

export function authUser (creds) {
  return callBackend({
    resource: '/auth',
    method: 'POST',
    data: creds
  })
}

export async function fetchMembers ({ token }) {
  const query = { fmt: 'lzs' }
  const data = await callBackend({
    resource: '/members',
    method: 'GET',
    token,
    query
  })
  return JSON.parse(decompressFromBase64(data.lzs))
}

export async function fetchFiles ({ token }) {
  const query = { fmt: 'lzs' }
  const data = await callBackend({
    resource: '/files',
    method: 'GET',
    token,
    query
  })
  return JSON.parse(decompressFromBase64(data.lzs))
}

export function fetchConfig () {
  return callBackend({
    resource: '/config',
    method: 'GET'
  })
}

export function postMember ({ token, member }) {
  return callBackend({
    resource: '/member',
    method: 'POST',
    token,
    data: { member },
    noResponse: true
  })
}

function callBackend (options) {
  const {
    resource,
    method,
    data,
    token,
    query = {},
    timeout = 30 * 10 * 1000,
    noResponse
  } = options

  const fetchOpts = {
    method,
    headers: {}
  }

  if (data && method !== 'GET') {
    fetchOpts.body = JSON.stringify(data)
    fetchOpts.headers['content-type'] = 'application/json'
  }

  if (config.isTest) query.db = 'test'

  query.ts = Date.now()
  const url = `${config.backend}${resource}${buildQuery(query)}`
  if (token) {
    fetchOpts.headers['Authorization'] = 'Bearer ' + token
  }

  return pTimeout(window.fetch(url, fetchOpts), timeout).then(response => {
    if (response.status === 401) {
      throw new Error('Not authorized')
    } else if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`)
    }
    if (noResponse) return
    return response.json()
  })
}

/*
    delete opts.json

  if (config.isTest) query.db = 'test'
  query.ts = Date.now()
  const url = `${config.backend}${resource}${buildQuery(query)}`

  if (token) opts.headers = { Authorization: 'Bearer ' + token }

  return ky(url, opts).then(response => {
    if (response.status === 401) {
      throw new Error('Not authorized')
    } else if (!response.ok) {
      throw new Error(`${response.status}: ${repsonse.statusText}`)
    }
    return response.json()
  })
}
*/
