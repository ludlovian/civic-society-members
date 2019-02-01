'use strict'

import m from 'mithril'

import classify from '../../lib/classify'

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

const Typography = {
  view ({ children, attrs }) {
    const {
      className,
      xattrs = {},
      ...rest } = attrs
    return classify(
      className,
      styles.map(n => {
        if (rest[n]) {
          rest[n] = undefined
          return 'mdc-typography--' + n
        }
      }),
      m('span', { ...rest, ...xattrs }, children)
    )
  }
}

styles.forEach(n => {
  const kl = `mdc-typography--${n}`
  const comp = {
    view ({ children, attrs }) {
      const {
        className,
        xattrs = {},
        ...rest } = attrs
      return classify(
        className,
        kl,
        m('span', { ...xattrs, ...rest }, children)
      )
    }
  }
  const name = n.replace(n[0], n[0].toUpperCase())
  Typography[name] = comp
})

export default Typography
