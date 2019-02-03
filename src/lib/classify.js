'use strict'

function classes (...args) {
  const ret = []
  args.forEach(arg => {
    if (!arg) return
    const targ = typeof arg
    if (targ === 'string') {
      ret.push(arg)
    } else if (Array.isArray(arg)) {
      ret.push(...classes(...arg))
    } else if (targ === 'object') {
      Object.keys(arg).forEach(k => {
        if (k && arg[k]) ret.push(k)
      })
    }
  })
  return ret
}

function classify (...args) {
  const vnode = args.pop()
  if (!vnode.attrs) vnode.attrs = {}
  vnode.attrs.className = classes(
    vnode.attrs.className,
    vnode.attrs.class,
    ...args
  ).join(' ')
  if (vnode.attrs.class) vnode.attrs.class = undefined
  return vnode
}

function classnames (...args) {
  return classes(...args).join(' ')
}

classify.classnames = classnames
export default classify
export { classify, classnames }
