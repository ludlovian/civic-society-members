'use strict'

const config = {
  // are we in test
  isTest: (process.env.NODE_ENV !== 'production'),

  // api endpoint
  backend: 'https://us-central1-ludlow-civic-225710.cloudfunctions.net/api',

  // after how long is the start up data considered stale
  refreshPeriod: 30 * 60 * 1000
}

export default config
