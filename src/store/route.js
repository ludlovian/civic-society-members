'use strict'

import { buildQuery } from '../lib/url'
import config from '../config'

export default {
  initial: {},

  actions: ({ state, views, update }) => {
    function toPage (page, data = {}, replace) {
      update({ page, data })
      setUrlFromState({ addPrefix: page !== '404', replace })
    }

    function setUrlFromState ({ addPrefix = true, replace = false } = {}) {
      const s = state()
      const url = (addPrefix ? config.basePath : '') + makeUrl(s)
      if (replace) {
        window.history.replaceState(s, null, url)
      } else {
        window.history.pushState(s, null, url)
      }
    }

    function updateData (patch) {
      const { page, data } = state()
      toPage(page, { ...data, ...patch })
    }

    function start () {
      window.addEventListener('popstate', e => {
        update(e.state)
      })

      const { page, data } = decodePath(window.location)
      toPage(page, data, true)
    }

    return {
      start,
      toPage,
      updateData
    }
  },

  views: ({ state }) => ({
    state,
    url: state.map(makeUrl)
  })
}

function makeUrl ({ page, data }) {
  switch (page) {
    case 'home':
      return `/${buildQuery({
        q: data && data.filter ? data.filter : undefined
      })}`
    case 'member':
      const { id, tab, edit } = data
      return `/member/${id}${buildQuery({ tab, edit })}`
    case 'newmember':
      return '/member/new'
    case 'spreadsheet':
      return '/spreadsheet'
    case 'login':
      return '/login'
    case 'logout':
      return '/logout'
    case 'error':
      return '/error'
    case '404':
      return data.url
  }
}

function decodePath ({ pathname, search, hash }) {
  let path
  let query
  let match

  if (!pathname.startsWith(config.basePath)) {
    return { page: 'home', data: { filter: '' } }
  }

  path = pathname.slice(config.basePath.length).replace(/\/$/, '')

  if (search[0] === '?') {
    query = search
      .slice(1)
      .split('&')
      .reduce((q, s) => {
        const [k, v] = s.split('=')
        q[k] = v === undefined ? true : v
        return q
      }, {})
  }

  if (path === '') {
    return { page: 'home', data: { filter: query ? query.q || '' : '' } }
  }

  match = /\/member\/(\d+)/.exec(path)
  if (match) {
    const page = 'member'
    query = query || {}
    const data = { id: match[1], tab: query.tab, edit: query.edit }
    return { page, data }
  }

  if (path === '/member/new') {
    return { page: 'newmember' }
  }

  if (path === '/login') {
    return { page: 'login' }
  }

  if (path === '/logout') {
    return { page: 'login' } // deliberate redirect to login
  }

  if (path === '/error') {
    return { page: 'error' }
  }

  return { page: '404', data: { url: pathname + search + hash } }
}
