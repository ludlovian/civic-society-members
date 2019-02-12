'use strict'

import h from '../../lib/hyperscript'

import classnames from 'classnames'

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
  template ({ children, class: cl, ...rest }) {
    cl = classnames(
      cl,
      styles.map(name => {
        if (rest[name]) {
          delete rest[name]
          return `mdc-typography--${name}`
        }
        return false
      })
    )
    return (
      <span class={cl} {...rest}>
        {children}
      </span>
    )
  }
}

styles.forEach(n => {
  const name = n.replace(n[0], n[0].toUpperCase())
  Typography[name] = {
    template: data => Typography.template({ ...data, [n]: true })
  }
})

export default Typography
