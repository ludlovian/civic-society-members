'use strict'

import * as domvm from 'domvm/dist/micro/domvm.micro'
import { use as materialUse } from 'domvm-material'

materialUse(domvm)

const { defineElementSpread: el, defineView: vw, createView } = domvm

export { el, vw, createView }
