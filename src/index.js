'use strict'

import '@babel/polyfill'
import { createView } from './domvm'

import { init, start } from './store'
import App from './components/App'

import './style/index.scss'

init()
start()

createView(App, {}).mount(document.getElementById('app'), true)
