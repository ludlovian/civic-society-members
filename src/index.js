'use strict'

import '@babel/polyfill'
import registerServiceWorker from './register-service-worker'
import config from './config'
import { createView } from './domvm'

import { init, start } from './store'
import App from './components/App'

import './style/index.scss'

registerServiceWorker(config.basePath + '/service-worker.js')

init()
start()

createView(App, {}).mount(document.getElementById('app'), true)
