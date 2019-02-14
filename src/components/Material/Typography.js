'use strict'

import { el, h, classify, hargs } from '../../domvm'

const styles = [
  'headline1',
  'headline2',
  'headline3',
  'headline4',
  'headline5',
  'headline6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'button',
  'overline'
]

function Typography (...args) {
  const [attrs, children] = hargs(args)
  return classify(
    styles.map(name => {
      if (attrs[name]) {
        delete attrs[name]
        return `mdc-typography--${name}`
      }
      return false
    }),
    el('span', attrs, children)
  )
}

styles.forEach(n => {
  const name = n.replace(n[0], n[0].toUpperCase())
  Typography[name] = (...args) => h('span.mdc-typography--' + n, ...args)
})

export default Typography
