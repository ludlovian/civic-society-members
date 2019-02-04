'use strict'

import m from 'mithril'

import { classnames } from '../../lib/classify'

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
    const { className, xattrs = {}, ...rest } = attrs
    const cl = classnames(
      className,
      styles.map(name => {
        if (rest[name]) {
          delete rest[name]
          return `mdc-typography--${name}`
        }
        return false
      })
    )

    return (
      <span className={cl} {...xattrs} {...rest}>
        {children}
      </span>
    )
  }
}

styles.forEach(n => {
  const klass = `mdc-typography--${n}`
  const comp = {
    view ({ children, attrs }) {
      const { className, xattrs = {}, ...rest } = attrs
      const cl = classnames(className, klass)
      return (
        <span className={cl} {...xattrs} {...rest}>
          {children}
        </span>
      )
    }
  }
  const name = n.replace(n[0], n[0].toUpperCase())
  Typography[name] = comp
})

export default Typography
